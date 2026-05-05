package com.feedlytics.service.feedback.service

import com.feedlytics.queue.feedback.v1.EnqueueFeedbackAnalysisRequest
import com.feedlytics.queue.feedback.v1.FeedbackAnalysisQueueGrpc
import com.feedlytics.queue.feedback.v1.NotificationWebhook
import com.feedlytics.service.feedback.dto.request.SendFeedbackRequest
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import net.devh.boot.grpc.client.inject.GrpcClient
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class FeedbackAnalysisGrpcEnqueueService(
    @Value("\${feedlytics.internal.auth-token}")
    private val internalAuthToken: String,
    @Value("\${feedlytics.queue.callback-base-url}")
    private val callbackBaseUrl: String,
) {

    private val logger = LoggerFactory.getLogger(FeedbackAnalysisGrpcEnqueueService::class.java)

    @GrpcClient("feedlyticsQueue")
    private lateinit var stub: FeedbackAnalysisQueueGrpc.FeedbackAnalysisQueueBlockingStub

    fun enqueueAfterCommit(
        savedFeedback: FeedbacksEntity,
        request: SendFeedbackRequest,
        categoryNames: List<String>,
    ) {
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
        }
    }
}
