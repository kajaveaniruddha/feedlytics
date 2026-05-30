package com.feedlytics.service.billing.event

import com.feedlytics.service.billing.entity.BillingAuditLogEntity
import com.feedlytics.service.billing.entity.enums.AuditActorType
import com.feedlytics.service.billing.entity.enums.BillingAuditAction
import com.feedlytics.service.billing.repository.BillingAuditLogRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class BillingAuditHandler(
    private val auditLogRepository: BillingAuditLogRepository,
) {
    private val objectMapper = ObjectMapper()
    private val logger = LoggerFactory.getLogger(BillingAuditHandler::class.java)

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onCheckoutCompleted(event: BillingDomainEvent.CheckoutCompleted) {
        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.STRIPE_WEBHOOK,
            actorId = event.stripeEventId,
            action = BillingAuditAction.SUBSCRIPTION_CREATED,
            newPlan = event.plan.name,
            metadata = mapOf(
                "priceId" to event.priceId,
                "interval" to event.interval,
                "stripeSubscriptionId" to event.stripeSubscriptionId,
            ),
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onSubscriptionUpdated(event: BillingDomainEvent.SubscriptionUpdated) {
        val action = if (event.previousPlan != null && event.newPlan.ordinal > event.previousPlan.ordinal) {
            BillingAuditAction.PLAN_UPGRADED
        } else {
            BillingAuditAction.PLAN_DOWNGRADED
        }

        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.STRIPE_WEBHOOK,
            actorId = event.stripeEventId,
            action = action,
            previousPlan = event.previousPlan?.name,
            newPlan = event.newPlan.name,
            metadata = mapOf(
                "priceId" to event.priceId,
                "interval" to event.interval,
            ),
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onSubscriptionDeleted(event: BillingDomainEvent.SubscriptionDeleted) {
        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.STRIPE_WEBHOOK,
            actorId = event.stripeEventId,
            action = BillingAuditAction.SUBSCRIPTION_CANCELLED,
            previousPlan = event.previousPlan?.name,
            newPlan = "FREE",
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onInvoicePaid(event: BillingDomainEvent.InvoicePaid) {
        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.STRIPE_WEBHOOK,
            actorId = event.stripeEventId,
            action = BillingAuditAction.SUBSCRIPTION_RENEWED,
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onCheckoutInitiated(event: BillingDomainEvent.CheckoutInitiated) {
        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.USER,
            actorId = event.userId.toString(),
            action = BillingAuditAction.CHECKOUT_INITIATED,
            newPlan = event.plan.name,
            metadata = mapOf("interval" to event.interval),
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun onPortalOpened(event: BillingDomainEvent.PortalOpened) {
        save(
            workspaceId = event.workspaceId,
            actorType = AuditActorType.USER,
            actorId = event.userId.toString(),
            action = BillingAuditAction.PORTAL_OPENED,
        )
    }

    private fun save(
        workspaceId: Long,
        actorType: AuditActorType,
        actorId: String? = null,
        action: BillingAuditAction,
        previousPlan: String? = null,
        newPlan: String? = null,
        metadata: Map<String, Any>? = null,
    ) {
        try {
            val metadataJson = metadata?.let { objectMapper.writeValueAsString(it) }
            auditLogRepository.save(
                BillingAuditLogEntity(
                    workspaceId = workspaceId,
                    actorType = actorType,
                    actorId = actorId,
                    action = action,
                    previousPlan = previousPlan,
                    newPlan = newPlan,
                    metadata = metadataJson,
                )
            )
            logger.info("Audit log saved: action={}, workspace={}", action, workspaceId)
        } catch (e: Exception) {
            logger.error("Failed to write billing audit log: action={}, workspace={}", action, workspaceId, e)
        }
    }
}
