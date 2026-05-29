package com.feedlytics.service.widget.service

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.auth.WidgetSecretAuthHandler
import com.feedlytics.service.widget.dto.request.PatchWorkspaceWidgetRequest
import com.feedlytics.service.widget.dto.response.WorkspaceWidgetResponse
import com.feedlytics.service.widget.entity.WidgetEntity
import com.feedlytics.service.widget.entity.WidgetThemeJson
import com.feedlytics.service.widget.repository.WidgetRepository
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.time.Instant
import java.util.UUID

@Service
class WorkspaceWidgetServiceImpl(
    private val widgetRepository: WidgetRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMembersRepository,
    private val planLimitStrategyFactory: PlanLimitStrategyFactory,
    private val widgetSecretAuthHandler: WidgetSecretAuthHandler,
) : WorkspaceWidgetService {

    private val allowedFonts = setOf(
        "Inter", "DM Sans", "Plus Jakarta Sans", "Poppins", "Space Grotesk", "Merriweather", "System",
    )
    private val allowedShadows = setOf("none", "subtle", "medium", "strong")
    private val allowedPadding = setOf("compact", "default", "spacious")
    private val hexColor = Regex("^#[0-9A-Fa-f]{6}$")

    @Transactional(readOnly = true)
    override fun getPublicConfig(workspacePublicId: UUID, origin: String?): WorkspaceWidgetResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)
        widgetSecretAuthHandler.requireAllowedOriginForPublicWidgetRead(workspace, origin)
        val widget = widgetRepository.findByWorkspaceId(workspace.id)
            ?: throw NotFoundException("WIDGET_NOT_FOUND", "Widget configuration not found")
        if (!widget.isActive) {
            throw ForbiddenException("WIDGET_INACTIVE", "This widget is not active")
        }
        return toResponse(widget)
    }

    @Transactional(readOnly = true)
    override fun getManagementConfig(workspacePublicId: UUID, userId: Long): WorkspaceWidgetResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val widget = widgetRepository.findByWorkspaceId(workspace.id)
            ?: throw NotFoundException("WIDGET_NOT_FOUND", "Widget configuration not found")
        return toResponse(widget)
    }

    @Transactional
    override fun patch(workspacePublicId: UUID, userId: Long, request: PatchWorkspaceWidgetRequest): WorkspaceWidgetResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val widget = widgetRepository.findByWorkspaceId(workspace.id)
            ?: throw NotFoundException("WIDGET_NOT_FOUND", "Widget configuration not found")

        request.collectName?.let { widget.collectName = it }
        request.collectEmail?.let { widget.collectEmail = it }
        request.isActive?.let { widget.isActive = it }
        request.theme?.let { newTheme ->
            validateTheme(newTheme)
            widget.theme = newTheme
        }

        widget.updatedAt = Instant.now()
        val saved = widgetRepository.save(widget)
        return toResponse(saved)
    }

    private fun validateTheme(t: WidgetThemeJson) {
        listOf(
            t.formBgColor, t.formTextColor, t.accentColor, t.inputBgColor,
            t.inputBorderColor, t.inputTextColor, t.secondaryTextColor,
        ).forEach { color ->
            if (!hexColor.matches(color)) {
                throw BadRequestException("INVALID_THEME", "Theme colors must be valid hex (#RRGGBB)")
            }
        }
        if (t.fontFamily !in allowedFonts) {
            throw BadRequestException("INVALID_THEME", "Unsupported fontFamily")
        }
        if (t.shadow !in allowedShadows) {
            throw BadRequestException("INVALID_THEME", "Invalid shadow value")
        }
        if (t.cardPadding !in allowedPadding) {
            throw BadRequestException("INVALID_THEME", "Invalid cardPadding value")
        }
        if (t.borderRadius !in 0..48) {
            throw BadRequestException("INVALID_THEME", "borderRadius must be between 0 and 48")
        }
        if (t.cardMaxWidth !in 280..720) {
            throw BadRequestException("INVALID_THEME", "cardMaxWidth must be between 280 and 720")
        }
        if (t.successMessage.isBlank() || t.successMessage.length > 500) {
            throw BadRequestException("INVALID_THEME", "successMessage must be 1–500 characters")
        }
        if (t.buttonText.isBlank() || t.buttonText.length > 120) {
            throw BadRequestException("INVALID_THEME", "buttonText must be 1–120 characters")
        }
        t.successRedirectUrl?.takeIf { it.isNotBlank() }?.let { requireHttpUrl(it, "successRedirectUrl") }
        t.successCtaUrl?.takeIf { it.isNotBlank() }?.let { requireHttpUrl(it, "successCtaUrl") }
        t.successCtaText?.let { text ->
            if (text.length > 120) {
                throw BadRequestException("INVALID_THEME", "successCtaText must be at most 120 characters")
            }
        }
    }

    private fun requireHttpUrl(raw: String, field: String) {
        try {
            val uri = URI.create(raw.trim())
            if (uri.scheme != "https" && uri.scheme != "http") {
                throw BadRequestException("INVALID_THEME", "$field must be an http(s) URL")
            }
        } catch (_: IllegalArgumentException) {
            throw BadRequestException("INVALID_THEME", "$field must be a valid URL")
        }
    }

    private fun toResponse(widget: WidgetEntity): WorkspaceWidgetResponse = WorkspaceWidgetResponse(
        collectName = widget.collectName,
        collectEmail = widget.collectEmail,
        theme = widget.theme,
        isActive = widget.isActive,
        createdAt = widget.createdAt,
        updatedAt = widget.updatedAt,
    )

    private fun findWorkspaceByPublicId(publicId: UUID): WorkspacesEntity =
        workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")

    private fun checkWorkspaceAccessible(workspace: WorkspacesEntity) {
        if (!planLimitStrategyFactory.getStrategy(workspace.plan).isAccessible()) {
            throw ForbiddenException(
                "WORKSPACE_ARCHIVED",
                "This workspace has been archived due to plan limits. Upgrade to PRO or BUSINESS to restore access.",
            )
        }
    }

    private fun requireOwnerOrAdmin(workspaceId: Long, userId: Long) {
        val allowedRoles = listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN)
        workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(userId, workspaceId, allowedRoles)
            ?: throw ForbiddenException("FORBIDDEN", "Only owner or admin can perform this action")
    }
}
