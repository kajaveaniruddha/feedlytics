package com.feedlytics.service.common.notification

import com.feedlytics.queue.email.v1.EnqueueVerificationEmailRequest
import com.feedlytics.queue.email.v1.VerificationEmailQueueGrpc
import com.feedlytics.queue.invitation.v1.EnqueueInvitationEmailRequest
import com.feedlytics.queue.invitation.v1.InvitationEmailQueueGrpc
import net.devh.boot.grpc.client.inject.GrpcClient
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class EmailNotificationChannel : NotificationChannel {

    private val logger = LoggerFactory.getLogger(EmailNotificationChannel::class.java)

    @GrpcClient("feedlyticsQueue")
    private lateinit var verificationStub: VerificationEmailQueueGrpc.VerificationEmailQueueBlockingStub

    @GrpcClient("feedlyticsQueue")
    private lateinit var invitationStub: InvitationEmailQueueGrpc.InvitationEmailQueueBlockingStub

    override val channelType: NotificationChannelType = NotificationChannelType.EMAIL

    override fun send(notification: Notification): NotificationResult {
        return when (notification) {
            is Notification.EmailVerification -> sendVerificationEmail(notification)
            is Notification.WorkspaceInvitation -> sendInvitationEmail(notification)
            else -> throw UnsupportedNotificationException("Notification type not supported on EMAIL channel")
        }
    }

    private fun sendVerificationEmail(n: Notification.EmailVerification): NotificationResult {
        val request = EnqueueVerificationEmailRequest.newBuilder()
            .setEmail(n.email)
            .setUsername(n.username)
            .setVerifyCode(n.verifyCode)
            .setExpiryAtEpochMs(n.expiryAtEpochMs)
            .build()

        val response = verificationStub
            .withDeadlineAfter(10, TimeUnit.SECONDS)
            .enqueueVerificationEmail(request)

        if (!response.accepted) {
            logger.warn("Queue service rejected verification email job for email={}", n.email)
            return NotificationResult.Rejected("queue_rejected")
        }
        return NotificationResult.Accepted
    }

    private fun sendInvitationEmail(n: Notification.WorkspaceInvitation): NotificationResult {
        val request = EnqueueInvitationEmailRequest.newBuilder()
            .setEmail(n.email)
            .setWorkspaceName(n.workspaceName)
            .setInviterName(n.inviterName)
            .setRole(n.role)
            .setInviteToken(n.inviteToken)
            .setExpiresAtEpochMs(n.expiresAtEpochMs)
            .build()

        val response = invitationStub
            .withDeadlineAfter(10, TimeUnit.SECONDS)
            .enqueueInvitationEmail(request)

        if (!response.accepted) {
            logger.warn(
                "Queue service rejected invitation email job for email={} workspace={}",
                n.email,
                n.workspaceName,
            )
            return NotificationResult.Rejected("queue_rejected")
        }
        return NotificationResult.Accepted
    }
}
