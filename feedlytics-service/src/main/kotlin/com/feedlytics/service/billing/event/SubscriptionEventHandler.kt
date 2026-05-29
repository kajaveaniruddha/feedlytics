package com.feedlytics.service.billing.event

import com.feedlytics.service.billing.entity.WorkspaceSubscriptionEntity
import com.feedlytics.service.billing.entity.enums.SubscriptionStatusEnum
import com.feedlytics.service.billing.repository.WorkspaceSubscriptionRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.WorkspacePlanService
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class SubscriptionEventHandler(
    private val subscriptionRepository: WorkspaceSubscriptionRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val workspacePlanService: WorkspacePlanService,
) {
    private val logger = LoggerFactory.getLogger(SubscriptionEventHandler::class.java)

    @EventListener
    @Transactional(propagation = Propagation.REQUIRED)
    fun onCheckoutCompleted(event: BillingDomainEvent.CheckoutCompleted) {
        logger.info("Processing CheckoutCompleted event: workspace={}, plan={}", event.workspaceId, event.plan)

        val subscription = WorkspaceSubscriptionEntity(
            workspaceId = event.workspaceId,
            stripeCustomerId = event.stripeCustomerId,
            stripeSubscriptionId = event.stripeSubscriptionId,
            stripePriceId = event.priceId,
            plan = event.plan,
            billingInterval = event.interval,
            status = SubscriptionStatusEnum.ACTIVE,
        )
        subscriptionRepository.save(subscription)
        logger.info("Saved workspace_subscription for workspace={}", event.workspaceId)

        val workspace = workspaceRepository.findById(event.workspaceId).orElse(null)
        if (workspace == null) {
            logger.error("Workspace {} not found during checkout completed", event.workspaceId)
            return
        }
        workspace.stripeCustomerId = event.stripeCustomerId
        workspace.stripeSubscriptionId = event.stripeSubscriptionId
        workspace.stripePriceId = event.priceId
        workspace.billingInterval = event.interval
        workspaceRepository.save(workspace)
        logger.info("Updated workspace stripe columns for workspace={}", event.workspaceId)

        workspace.plan = event.plan
        workspaceRepository.save(workspace)

        logger.info(
            "Checkout completed: workspace={} upgraded to {} ({})",
            event.workspaceId, event.plan, event.interval,
        )
    }

    @EventListener
    @Transactional(propagation = Propagation.REQUIRED)
    fun onSubscriptionUpdated(event: BillingDomainEvent.SubscriptionUpdated) {
        logger.info("Processing SubscriptionUpdated event: workspace={}, newPlan={}", event.workspaceId, event.newPlan)

        val subscription = subscriptionRepository.findByStripeCustomerId(event.stripeCustomerId)
        if (subscription != null) {
            subscription.stripePriceId = event.priceId
            subscription.plan = event.newPlan
            subscription.billingInterval = event.interval
            subscriptionRepository.save(subscription)
        }

        val workspace = workspaceRepository.findByStripeCustomerId(event.stripeCustomerId) ?: return
        workspace.stripePriceId = event.priceId
        workspace.billingInterval = event.interval
        workspace.plan = event.newPlan
        workspaceRepository.save(workspace)

        logger.info(
            "Subscription updated: workspace={} → {} ({})",
            workspace.id, event.newPlan, event.interval,
        )
    }

    @EventListener
    @Transactional(propagation = Propagation.REQUIRED)
    fun onSubscriptionDeleted(event: BillingDomainEvent.SubscriptionDeleted) {
        logger.info("Processing SubscriptionDeleted event: workspace={}", event.workspaceId)

        val subscription = subscriptionRepository.findByStripeCustomerId(event.stripeCustomerId)
        if (subscription != null) {
            subscription.status = SubscriptionStatusEnum.CANCELLED
            subscription.cancelledAt = Instant.now()
            subscriptionRepository.save(subscription)
        }

        val workspace = workspaceRepository.findByStripeCustomerId(event.stripeCustomerId) ?: return
        workspace.stripeSubscriptionId = null
        workspace.stripePriceId = null
        workspace.billingInterval = null
        workspaceRepository.save(workspace)

        workspacePlanService.downgradeToFree(workspace.id)

        logger.info("Subscription deleted: workspace={} downgraded to FREE", workspace.id)
    }

    @EventListener
    @Transactional(propagation = Propagation.REQUIRED)
    fun onInvoicePaid(event: BillingDomainEvent.InvoicePaid) {
        logger.info("Processing InvoicePaid event: workspace={}", event.workspaceId)

        val subscription = subscriptionRepository.findByStripeCustomerId(event.stripeCustomerId)
        if (subscription != null) {
            subscription.status = SubscriptionStatusEnum.ACTIVE
            subscriptionRepository.save(subscription)
        }

        logger.info("Invoice paid for workspace={}", event.workspaceId)
    }
}
