package com.feedlytics.service.billing.service

import com.feedlytics.service.billing.config.StripePriceResolver
import com.feedlytics.service.billing.entity.ProcessedStripeEventEntity
import com.feedlytics.service.billing.event.BillingDomainEvent
import com.feedlytics.service.billing.repository.ProcessedStripeEventRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.stripe.model.Event
import com.stripe.model.Invoice
import com.stripe.model.StripeObject
import com.stripe.model.Subscription
import com.stripe.model.checkout.Session
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WebhookEventProcessor(
    private val stripePriceResolver: StripePriceResolver,
    private val workspaceRepository: WorkspaceRepository,
    private val processedEventRepository: ProcessedStripeEventRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {
    private val logger = LoggerFactory.getLogger(WebhookEventProcessor::class.java)

    @Transactional
    fun processAndPublish(event: Event) {
        processedEventRepository.save(
            ProcessedStripeEventEntity(stripeEventId = event.id, eventType = event.type)
        )

        when (event.type) {
            "checkout.session.completed" -> handleCheckoutCompleted(event)
            "invoice.paid" -> handleInvoicePaid(event)
            "customer.subscription.updated" -> handleSubscriptionUpdated(event)
            "customer.subscription.deleted" -> handleSubscriptionDeleted(event)
            else -> logger.debug("Unhandled event type: {}", event.type)
        }
    }

    private fun deserializeEvent(event: Event): StripeObject {
        val deserializer = event.dataObjectDeserializer
        if (deserializer.`object`.isPresent) {
            return deserializer.`object`.get()
        }
        logger.warn("API version mismatch for event {}, using unsafe deserialization", event.id)
        return deserializer.deserializeUnsafe()
    }

    private fun handleCheckoutCompleted(event: Event) {
        val session = deserializeEvent(event) as Session

        val workspaceIdStr = session.metadata?.get("workspaceId")
            ?: run {
                logger.warn("checkout.session.completed missing workspaceId metadata")
                return
            }

        val workspaceId = workspaceIdStr.toLongOrNull()
            ?: run {
                logger.warn("checkout.session.completed invalid workspaceId: {}", workspaceIdStr)
                return
            }

        val subscriptionId = session.getSubscription()
            ?: run {
                logger.warn("checkout.session.completed missing subscription ID")
                return
            }

        logger.info("Retrieving subscription {} from Stripe API", subscriptionId)
        val subscription = Subscription.retrieve(subscriptionId)
        val priceId = subscription.items.data.firstOrNull()?.price?.id
            ?: run {
                logger.warn("Could not extract price ID from subscription {}", subscriptionId)
                return
            }

        logger.info("Resolved price ID: {}", priceId)
        val resolvedPlan = stripePriceResolver.resolvePlan(priceId)
            ?: run {
                logger.warn("Unknown price ID from checkout: {}", priceId)
                return
            }

        logger.info(
            "Publishing CheckoutCompleted event: workspace={}, plan={}, customer={}",
            workspaceId, resolvedPlan.plan, session.getCustomer(),
        )

        eventPublisher.publishEvent(
            BillingDomainEvent.CheckoutCompleted(
                workspaceId = workspaceId,
                stripeCustomerId = session.getCustomer(),
                stripeSubscriptionId = subscriptionId,
                priceId = priceId,
                plan = resolvedPlan.plan,
                interval = resolvedPlan.interval,
                stripeEventId = event.id,
            )
        )
    }

    private fun handleInvoicePaid(event: Event) {
        val invoice = deserializeEvent(event) as Invoice

        if (invoice.billingReason == "subscription_create") {
            logger.info("Skipping invoice.paid for subscription_create")
            return
        }

        val customerId = invoice.getCustomer()
        val workspace = workspaceRepository.findByStripeCustomerId(customerId)

        eventPublisher.publishEvent(
            BillingDomainEvent.InvoicePaid(
                workspaceId = workspace?.id ?: 0,
                stripeCustomerId = customerId,
                stripeEventId = event.id,
            )
        )
    }

    private fun handleSubscriptionUpdated(event: Event) {
        val subscription = deserializeEvent(event) as Subscription

        val customerId = subscription.customer
        val priceId = subscription.items.data.firstOrNull()?.price?.id ?: return

        val resolvedPlan = stripePriceResolver.resolvePlan(priceId) ?: run {
            logger.warn("subscription.updated: unknown price ID {}", priceId)
            return
        }

        val workspace = workspaceRepository.findByStripeCustomerId(customerId) ?: run {
            logger.warn("subscription.updated: no workspace found for customer {}", customerId)
            return
        }

        eventPublisher.publishEvent(
            BillingDomainEvent.SubscriptionUpdated(
                workspaceId = workspace.id,
                stripeCustomerId = customerId,
                priceId = priceId,
                previousPlan = workspace.plan,
                newPlan = resolvedPlan.plan,
                interval = resolvedPlan.interval,
                stripeEventId = event.id,
            )
        )
    }

    private fun handleSubscriptionDeleted(event: Event) {
        val subscription = deserializeEvent(event) as Subscription

        val customerId = subscription.customer

        val workspace = workspaceRepository.findByStripeCustomerId(customerId) ?: run {
            logger.warn("subscription.deleted: no workspace found for customer {}", customerId)
            return
        }

        eventPublisher.publishEvent(
            BillingDomainEvent.SubscriptionDeleted(
                workspaceId = workspace.id,
                stripeCustomerId = customerId,
                previousPlan = workspace.plan,
                stripeEventId = event.id,
            )
        )
    }
}
