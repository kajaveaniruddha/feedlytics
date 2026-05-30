package com.feedlytics.service.feedback.auth

import com.feedlytics.service.common.exception.UnauthorizedException
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.stereotype.Service

@Service
class FeedbackAuthService(
    apiKeyAuthHandler: ApiKeyAuthHandler,
    widgetSecretAuthHandler: WidgetSecretAuthHandler,
) {
    private val chain: FeedbackAuthHandler =
        apiKeyAuthHandler.also { it.setNext(widgetSecretAuthHandler) }

    fun requireApiKeyOrWidgetSecret(
        workspace: WorkspacesEntity,
        apiKeyHeader: String?,
        widgetSecretHeader: String?,
        origin: String?,
        bearerToken: String? = null,
        ipAddress: String? = null,
    ): SourceTypeEnum {
        val apiKey = apiKeyHeader?.trim()?.takeIf { it.isNotEmpty() }
        val widgetSecret = widgetSecretHeader?.trim()?.takeIf { it.isNotEmpty() }
        val request = FeedbackAuthRequest(
            workspace = workspace,
            apiKey = apiKey,
            widgetSecret = widgetSecret,
            origin = origin,
            bearerToken = bearerToken,
            ipAddress = ipAddress,
        )
        return when (val result = chain.handle(request)) {
            is AuthResult.Success -> result.sourceType
            is AuthResult.Failure -> throw UnauthorizedException(
                "INVALID_CREDENTIALS",
                "Invalid or missing workspace credentials. Configure an API key or widget secret for this workspace.",
            )
        }
    }
}
