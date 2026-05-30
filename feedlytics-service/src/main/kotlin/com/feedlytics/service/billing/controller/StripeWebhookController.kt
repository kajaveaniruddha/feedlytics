package com.feedlytics.service.billing.controller

import com.feedlytics.service.billing.config.StripeProperties
import com.feedlytics.service.billing.repository.ProcessedStripeEventRepository
import com.feedlytics.service.billing.service.WebhookEventProcessor
import com.stripe.model.Event
import com.stripe.net.Webhook
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/webhooks/stripe")
class StripeWebhookController(
    private val stripeProperties: StripeProperties,
    private val processedEventRepository: ProcessedStripeEventRepository,
    private val webhookEventProcessor: WebhookEventProcessor,
) {
    private val logger = LoggerFactory.getLogger(StripeWebhookController::class.java)

    @PostMapping
    fun handleWebhook(
        @RequestBody payload: String,
        @RequestHeader("Stripe-Signature") sigHeader: String,
    ): ResponseEntity<Map<String, Boolean>> {
        val event: Event = try {
            Webhook.constructEvent(payload, sigHeader, stripeProperties.webhookSecret)
        } catch (e: Exception) {
            logger.warn("Webhook signature verification failed: {}", e.message)
            return ResponseEntity.badRequest().body(mapOf("received" to false))
        }

        logger.info("Received Stripe event: type={}, id={}", event.type, event.id)

        if (processedEventRepository.existsByStripeEventId(event.id)) {
            logger.info("Duplicate event skipped: id={}", event.id)
            return ResponseEntity.ok(mapOf("received" to true))
        }

        try {
            webhookEventProcessor.processAndPublish(event)
        } catch (e: Exception) {
            logger.error("Error processing webhook event {}: {}", event.type, e.message, e)
            return ResponseEntity.internalServerError().body(mapOf("received" to false))
        }

        return ResponseEntity.ok(mapOf("received" to true))
    }
}
