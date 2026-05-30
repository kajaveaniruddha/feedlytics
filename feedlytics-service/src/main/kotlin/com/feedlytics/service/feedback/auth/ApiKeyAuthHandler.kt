package com.feedlytics.service.feedback.auth

import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class ApiKeyAuthHandler(
    private val passwordEncoder: PasswordEncoder,
) : BaseAuthHandler() {

    override fun canHandle(request: FeedbackAuthRequest): Boolean =
        !request.apiKey.isNullOrBlank()

    override fun authenticate(request: FeedbackAuthRequest): AuthResult {
        val workspace = request.workspace
        val apiKey = request.apiKey!!.trim()
        if (!workspace.apiKeyHash.isNullOrBlank() &&
            passwordEncoder.matches(apiKey, workspace.apiKeyHash)
        ) {
            return AuthResult.Success(SourceTypeEnum.API_KEY)
        }
        return AuthResult.Failure("Invalid API key")
    }
}
