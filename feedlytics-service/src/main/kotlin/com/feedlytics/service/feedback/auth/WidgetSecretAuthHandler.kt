package com.feedlytics.service.feedback.auth

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class WidgetSecretAuthHandler(
    private val passwordEncoder: PasswordEncoder,
) : BaseAuthHandler() {

    private val objectMapper = ObjectMapper()

    override fun canHandle(request: FeedbackAuthRequest): Boolean =
        !request.widgetSecret.isNullOrBlank()

    override fun authenticate(request: FeedbackAuthRequest): AuthResult {
        val workspace = request.workspace
        val widgetSecret = request.widgetSecret!!.trim()
        if (!workspace.widgetSecretHash.isNullOrBlank() &&
            passwordEncoder.matches(widgetSecret, workspace.widgetSecretHash)
        ) {
            requireWidgetOrigin(workspace, request.origin)
            return AuthResult.Success(SourceTypeEnum.WIDGET)
        }
        return AuthResult.Failure("Invalid widget secret")
    }

    /** Public widget config (GET): no secret; [origin] must match workspace allowed origins. */
    fun requireAllowedOriginForPublicWidgetRead(workspace: WorkspacesEntity, origin: String?) {
        requireWidgetOrigin(workspace, origin)
    }

    private fun requireWidgetOrigin(workspace: WorkspacesEntity, origin: String?) {
        val raw = workspace.widgetAllowedOrigins?.trim()?.takeIf { it.isNotEmpty() }
            ?: throw ForbiddenException(
                "WIDGET_ORIGIN_NOT_CONFIGURED",
                "Widget allowed origins are not configured for this workspace",
            )
        val allowed: List<String> = try {
            objectMapper.readValue(raw, object : TypeReference<List<String>>() {})
        } catch (_: Exception) {
            throw ForbiddenException("INVALID_ORIGIN_CONFIG", "Workspace widget origin configuration is invalid")
        }
        val requestOrigin = origin?.trim().orEmpty()
        if (requestOrigin.isEmpty()) {
            throw ForbiddenException("ORIGIN_REQUIRED", "Origin header is required")
        }
        val normalizedRequest = normalizeOrigin(requestOrigin)
        val ok = allowed.any { normalizeOrigin(it) == normalizedRequest }
        if (!ok) {
            throw ForbiddenException("ORIGIN_NOT_ALLOWED", "Origin is not allowed for this workspace")
        }
    }

    private fun normalizeOrigin(o: String): String = o.trim().removeSuffix("/")
}
