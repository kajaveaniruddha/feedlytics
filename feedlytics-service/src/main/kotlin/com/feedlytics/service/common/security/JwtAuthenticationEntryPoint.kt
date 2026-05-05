package com.feedlytics.service.common.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

@Component
class JwtAuthenticationEntryPoint : AuthenticationEntryPoint {

    private val objectMapper = ObjectMapper()

    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException
    ) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.contentType = MediaType.APPLICATION_JSON_VALUE

        val tokenError = request.getAttribute(JwtAuthenticationFilter.TOKEN_ERROR_ATTRIBUTE) as? String

        val (code, message) = when (tokenError) {
            "TOKEN_EXPIRED" -> "TOKEN_EXPIRED" to "Access token has expired. Please refresh your token."
            "INVALID_TOKEN" -> "INVALID_TOKEN" to "Invalid access token."
            "USER_NOT_FOUND" -> "USER_NOT_FOUND" to "User not found."
            else -> "UNAUTHORIZED" to "Authentication required."
        }

        val body = mapOf(
            "success" to false,
            "error" to mapOf(
                "code" to code,
                "message" to message
            )
        )

        objectMapper.writeValue(response.outputStream, body)
    }
}
