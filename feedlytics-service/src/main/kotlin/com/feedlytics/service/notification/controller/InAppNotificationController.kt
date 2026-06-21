package com.feedlytics.service.notification.controller

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.notification.dto.NotificationListResponseDto
import com.feedlytics.service.notification.dto.NotificationResponseDto
import com.feedlytics.service.notification.dto.NotificationUnreadCountResponse
import com.feedlytics.service.notification.service.InAppNotificationQueryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "In-app notifications", description = "GET-only inbox and unread count")
class InAppNotificationController(
    private val queryService: InAppNotificationQueryService,
) {

    @GetMapping
    @Operation(summary = "List notifications (newest first)")
    fun list(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @RequestParam(name = "cursor", required = false) cursor: String?,
        @RequestParam(name = "limit", required = false, defaultValue = "20") limit: Int,
        @RequestParam(name = "readStatus", required = false, defaultValue = "all") readStatus: String,
        @RequestParam(name = "type", required = false) type: String?,
        @RequestParam(name = "workspacePublicId", required = false) workspacePublicId: UUID?,
    ): NotificationListResponseDto {
        val safeLimit = limit.coerceIn(1, 100)
        return try {
            queryService.list(
                userId = user.id,
                cursor = cursor,
                limit = safeLimit,
                readStatus = readStatus,
                typeFilter = type,
                workspacePublicId = workspacePublicId,
            )
        } catch (_: IllegalArgumentException) {
            throw BadRequestException("INVALID_CURSOR", "Invalid cursor")
        }
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Unread notification count (badge)")
    fun unreadCount(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @RequestParam(name = "workspacePublicId", required = false) workspacePublicId: UUID?,
    ): NotificationUnreadCountResponse =
        NotificationUnreadCountResponse(queryService.unreadCount(user.id, workspacePublicId))

    @GetMapping("/{publicId}")
    @Operation(summary = "Get one notification by public id")
    fun getOne(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable publicId: UUID,
    ): NotificationResponseDto = queryService.getByPublicId(user.id, publicId)
}
