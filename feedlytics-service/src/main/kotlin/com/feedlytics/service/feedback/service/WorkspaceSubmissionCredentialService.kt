package com.feedlytics.service.feedback.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.UnauthorizedException
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class WorkspaceSubmissionCredentialService(
    private val passwordEncoder: PasswordEncoder,
) {

    private val objectMapper = ObjectMapper()

    fun requireApiKeyOrWidgetSecret(
        workspace: WorkspacesEntity,
        apiKeyHeader: String?,
        widgetSecretHeader: String?,
        origin: String?,
    ): SourceTypeEnum {
        val apiKey = apiKeyHeader?.trim()?.takeIf { it.isNotEmpty() }
        val widgetSecret = widgetSecretHeader?.trim()?.takeIf { it.isNotEmpty() }

        if (apiKey != null && !workspace.apiKeyHash.isNullOrBlank() &&
            passwordEncoder.matches(apiKey, workspace.apiKeyHash)
        ) {
            return SourceTypeEnum.API_KEY
        }

        if (widgetSecret != null && !workspace.widgetSecretHash.isNullOrBlank() &&
            passwordEncoder.matches(widgetSecret, workspace.widgetSecretHash)
        ) {
            requireWidgetOrigin(workspace, origin)
            return SourceTypeEnum.WIDGET
        }

        throw UnauthorizedException(
            "INVALID_CREDENTIALS",
            "Invalid or missing workspace credentials. Configure an API key or widget secret for this workspace.",
        )
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
            throw ForbiddenException("ORIGIN_REQUIRED", "Origin header is required for widget submissions")
        }
        val normalizedRequest = normalizeOrigin(requestOrigin)
        val ok = allowed.any { normalizeOrigin(it) == normalizedRequest }
        if (!ok) {
            throw ForbiddenException("ORIGIN_NOT_ALLOWED", "Origin is not allowed for this workspace")
        }
    }

    private fun normalizeOrigin(o: String): String = o.trim().removeSuffix("/")
}
