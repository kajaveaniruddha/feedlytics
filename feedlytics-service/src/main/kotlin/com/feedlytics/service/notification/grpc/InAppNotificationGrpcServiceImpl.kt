package com.feedlytics.service.notification.grpc

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import com.feedlytics.service.notification.service.InAppNotificationApplicationService
import com.feedlytics.service.notification.v1.CreateInAppNotificationRequest
import com.feedlytics.service.notification.v1.CreateInAppNotificationResponse
import com.feedlytics.service.notification.v1.InAppNotificationServiceGrpc
import com.feedlytics.service.notification.v1.NotificationType
import io.grpc.Status
import io.grpc.stub.StreamObserver
import net.devh.boot.grpc.server.service.GrpcService
import org.slf4j.LoggerFactory

@GrpcService
class InAppNotificationGrpcServiceImpl(
    private val applicationService: InAppNotificationApplicationService,
    private val objectMapper: ObjectMapper,
) : InAppNotificationServiceGrpc.InAppNotificationServiceImplBase() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun createInAppNotification(
        request: CreateInAppNotificationRequest,
        responseObserver: StreamObserver<CreateInAppNotificationResponse>,
    ) {
        if (request.type == NotificationType.NOTIFICATION_TYPE_UNSPECIFIED) {
            responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("type required").asRuntimeException())
            return
        }
        val type = when (request.type) {
            NotificationType.WORKSPACE_INVITE_PENDING -> NotificationTypeEnum.WORKSPACE_INVITE_PENDING
            else -> {
                responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("unsupported type").asRuntimeException())
                return
            }
        }
        try {
            val payload: Map<String, Any?> = objectMapper.readValue(
                request.payloadJson,
                object : TypeReference<MutableMap<String, Any?>>() {},
            )
            val result = applicationService.createOrGetExisting(
                recipientUserId = request.recipientUserId,
                workspaceId = if (request.hasWorkspaceId()) request.workspaceId else null,
                type = type,
                dedupeKey = request.dedupeKey,
                payload = payload,
            )
            responseObserver.onNext(
                CreateInAppNotificationResponse.newBuilder()
                    .setPublicId(result.publicId.toString())
                    .setId(result.id)
                    .setCreated(result.created)
                    .build(),
            )
            responseObserver.onCompleted()
        } catch (e: Exception) {
            log.warn("CreateInAppNotification failed: {}", e.message)
            responseObserver.onError(Status.INTERNAL.withDescription(e.message ?: "error").asRuntimeException())
        }
    }
}
