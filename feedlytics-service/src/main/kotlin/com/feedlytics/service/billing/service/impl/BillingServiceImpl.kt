package com.feedlytics.service.billing.service.impl

import com.feedlytics.service.billing.config.StripePriceResolver
import com.feedlytics.service.billing.config.StripeProperties
import com.feedlytics.service.billing.dto.request.CheckoutSessionRequest
import com.feedlytics.service.billing.dto.response.BillingInfoResponse
import com.feedlytics.service.billing.dto.response.CheckoutSessionResponse
import com.feedlytics.service.billing.dto.response.PortalSessionResponse
import com.feedlytics.service.billing.event.BillingDomainEvent
import com.feedlytics.service.billing.repository.WorkspaceSubscriptionRepository
import com.feedlytics.service.billing.service.BillingService
import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.stripe.model.checkout.Session
import com.stripe.param.billingportal.SessionCreateParams as PortalSessionCreateParams
import com.stripe.param.checkout.SessionCreateParams
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class BillingServiceImpl(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMembersRepository: WorkspaceMembersRepository,
    private val userRepository: UserRepository,
    private val stripePriceResolver: StripePriceResolver,
    private val stripeProperties: StripeProperties,
    private val subscriptionRepository: WorkspaceSubscriptionRepository,
    private val eventPublisher: ApplicationEventPublisher,
) : BillingService {

    private val logger = LoggerFactory.getLogger(BillingServiceImpl::class.java)

    @Transactional(readOnly = true)
    override fun getBillingInfo(workspacePublicId: UUID, userId: Long): BillingInfoResponse {
        val workspace = findWorkspace(workspacePublicId)
        requireMember(workspace.id, userId)

        val isOwner = workspace.ownerId == userId
        val hasSub = workspace.stripeSubscriptionId != null

        val subscription = subscriptionRepository.findByWorkspaceId(workspace.id)

        return BillingInfoResponse(
            plan = workspace.plan,
            billingInterval = workspace.billingInterval,
            hasSubscription = hasSub,
            stripeSubscriptionId = if (isOwner) workspace.stripeSubscriptionId else null,
            canManageBilling = isOwner && hasSub,
            subscriptionStatus = subscription?.status?.name,
            currentPeriodEnd = subscription?.currentPeriodEnd?.toString(),
        )
    }

    @Transactional(readOnly = true)
    override fun createCheckoutSession(
        workspacePublicId: UUID,
        userId: Long,
        request: CheckoutSessionRequest,
        origin: String,
    ): CheckoutSessionResponse {
        val workspace = findWorkspace(workspacePublicId)
        requireOwner(workspace, userId)

        if (workspace.stripeSubscriptionId != null) {
            throw BadRequestException(
                "ALREADY_SUBSCRIBED",
                "This workspace already has an active subscription. Use the billing portal to change plans."
            )
        }

        val targetPlan = PlansEnum.valueOf(request.plan)
        val priceId = stripePriceResolver.getPriceId(targetPlan, request.interval)
            ?: throw BadRequestException("INVALID_PLAN", "Price not configured for ${request.plan} ${request.interval}")

        val user = userRepository.findById(userId)
            .orElseThrow { NotFoundException("USER_NOT_FOUND", "User not found") }

        val successUrl = "$origin/workspaces/${workspace.publicId}/billing?checkout=success"
        val cancelUrl = "$origin/workspaces/${workspace.publicId}/billing?checkout=cancelled"

        val paramsBuilder = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice(priceId)
                    .setQuantity(1L)
                    .build()
            )
            .setSuccessUrl(successUrl)
            .setCancelUrl(cancelUrl)
            .putMetadata("workspacePublicId", workspace.publicId.toString())
            .putMetadata("workspaceId", workspace.id.toString())
            .putMetadata("userId", userId.toString())

        if (workspace.stripeCustomerId != null) {
            paramsBuilder.setCustomer(workspace.stripeCustomerId)
        } else {
            paramsBuilder.setCustomerEmail(user.email)
        }

        val session = Session.create(paramsBuilder.build())

        logger.info(
            "Created checkout session {} for workspace {} (plan={}, interval={})",
            session.id, workspace.publicId, request.plan, request.interval
        )

        eventPublisher.publishEvent(
            BillingDomainEvent.CheckoutInitiated(
                workspaceId = workspace.id,
                userId = userId,
                plan = targetPlan,
                interval = request.interval,
            )
        )

        return CheckoutSessionResponse(url = session.getUrl())
    }

    @Transactional(readOnly = true)
    override fun createPortalSession(
        workspacePublicId: UUID,
        userId: Long,
        origin: String,
    ): PortalSessionResponse {
        val workspace = findWorkspace(workspacePublicId)
        requireOwner(workspace, userId)

        val customerId = workspace.stripeCustomerId
            ?: throw BadRequestException("NO_BILLING_ACCOUNT", "No billing account found for this workspace")

        val returnUrl = "$origin/workspaces/${workspace.publicId}/billing"

        val params = PortalSessionCreateParams.builder()
            .setCustomer(customerId)
            .setReturnUrl(returnUrl)
            .build()

        val portalSession = com.stripe.model.billingportal.Session.create(params)

        logger.info("Created portal session for workspace {}", workspace.publicId)

        eventPublisher.publishEvent(
            BillingDomainEvent.PortalOpened(
                workspaceId = workspace.id,
                userId = userId,
            )
        )

        return PortalSessionResponse(url = portalSession.getUrl())
    }

    private fun findWorkspace(publicId: UUID): WorkspacesEntity =
        workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")

    private fun requireMember(workspaceId: Long, userId: Long) {
        if (!workspaceMembersRepository.existsByUserIdAndWorkspaceId(userId, workspaceId)) {
            throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        }
    }

    private fun requireOwner(workspace: WorkspacesEntity, userId: Long) {
        if (workspace.ownerId != userId) {
            throw ForbiddenException("FORBIDDEN", "Only the workspace owner can manage billing")
        }
    }
}
