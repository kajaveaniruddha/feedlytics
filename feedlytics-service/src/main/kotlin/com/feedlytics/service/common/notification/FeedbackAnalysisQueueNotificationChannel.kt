package com.feedlytics.service.common.notification

import com.feedlytics.queue.feedback.v1.EnqueueFeedbackAnalysisRequest
import com.feedlytics.queue.feedback.v1.FeedbackAnalysisQueueGrpc
import net.devh.boot.grpc.client.inject.GrpcClient
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class FeedbackAnalysisQueueNotificationChannel(
    @Value("\${feedlytics.internal.auth-token}")
    private val internalAuthToken: String,
    @Value("\${feedlytics.queue.callback-base-url}")
    private val callbackBaseUrl: String,
) : NotificationChannel {

    private val logger = LoggerFactory.getLogger(FeedbackAnalysisQueueNotificationChannel::class.java)

    @GrpcClient("feedlyticsQueue")
    private lateinit var stub: FeedbackAnalysisQueueGrpc.FeedbackAnalysisQueueBlockingStub

    override val channelType: NotificationChannelType = NotificationChannelType.FEEDBACK_ANALYSIS_QUEUE

    override fun send(notification: Notification): NotificationResult {
        val n = notification as? Notification.FeedbackAnalysisEnqueue
            ?: throw UnsupportedNotificationException("Notification type not supported on FEEDBACK_ANALYSIS_QUEUE channel")

        val savedFeedback = n.savedFeedback
        val request = n.request
        val categoryNames = n.categoryNames

        val base = callbackBaseUrl.trimEnd('/')
        val builder = EnqueueFeedbackAnalysisRequest.newBuilder()
            .setFeedbackId(savedFeedback.id)
            .setContent(request.content)
            .addAllWorkspaceCategoryName(categoryNames)
            .setCallbackBaseUrl(base)
            .setInternalAuthToken(internalAuthToken)
            .setRating(request.rating)
            .setSubmittedAtEpochMs(java.time.Instant.now().toEpochMilli())

        val response = stub
            .withDeadlineAfter(10, TimeUnit.SECONDS)
            .enqueueFeedbackAnalysis(builder.build())

        if (!response.accepted) {
            logger.warn("Queue service rejected feedback analysis job for feedbackId={}", savedFeedback.id)
            return NotificationResult.Rejected("queue_rejected")
        }
        return NotificationResult.Accepted
    }
}
