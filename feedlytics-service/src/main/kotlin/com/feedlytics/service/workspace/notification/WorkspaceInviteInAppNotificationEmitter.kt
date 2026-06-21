package com.feedlytics.service.workspace.notification

import com.feedlytics.service.common.entity.User
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import com.feedlytics.service.notification.service.InAppNotificationApplicationService
import com.feedlytics.service.workspace.entity.InviteEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.stereotype.Component

@Component
class WorkspaceInviteInAppNotificationEmitter(
    private val inAppNotificationApplicationService: InAppNotificationApplicationService,
) {

    fun emitInviteCreated(
        invite: InviteEntity,
        workspace: WorkspacesEntity,
        inviter: User,
        inviteeUser: User,
    ) {
        val dedupe = inAppNotificationApplicationService.dedupeKeyForInvitePending(invite.id)
        val payload = mapOf(
            "title" to "Workspace invitation",
            "description" to "You were invited to join ${workspace.name} on Feedlytics.",
            "entityIds" to mapOf(
                "workspacePublicId" to workspace.publicId.toString(),
                "inviteId" to invite.id.toString(),
                "inviterUserPublicId" to inviter.publicId.toString(),
            ),
            "severity" to "INFO",
        )
        inAppNotificationApplicationService.createOrGetExisting(
            recipientUserId = inviteeUser.id,
            workspaceId = workspace.id,
            type = NotificationTypeEnum.WORKSPACE_INVITE_PENDING,
            dedupeKey = dedupe,
            payload = payload,
        )
    }

    fun consumeInviteClosed(inviteeUserId: Long, inviteId: java.util.UUID, reason: String) {
        val dedupe = inAppNotificationApplicationService.dedupeKeyForInvitePending(inviteId)
        inAppNotificationApplicationService.deleteByRecipientAndDedupeKey(inviteeUserId, dedupe, reason)
    }
}
