package com.feedlytics.service.notification.ws

import com.feedlytics.service.common.config.CorsProperties
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.common.security.JwtService
import com.feedlytics.service.common.security.TokenValidationResult
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import org.springframework.web.socket.server.HandshakeInterceptor
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import java.util.UUID

@Configuration
@EnableWebSocket
class NotificationWebSocketConfig(
    private val notificationWebSocketHandler: NotificationWebSocketHandler,
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
    private val corsProperties: CorsProperties,
) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        val origins = corsProperties.resolvedOrigins().toTypedArray()
        registry
            .addHandler(notificationWebSocketHandler, "/api/v1/notifications/stream")
            .addInterceptors(NotificationJwtHandshakeInterceptor(jwtService, userRepository))
            .setAllowedOrigins(*origins)
    }

    companion object {
        const val USER_ID_ATTR = "NOTIFICATION_WS_USER_ID"
    }
}

class NotificationJwtHandshakeInterceptor(
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
) : HandshakeInterceptor {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>,
    ): Boolean {
        val token = parseQueryParam(request.uri.query, "access_token")
            ?: extractBearer(request.headers.getFirst(HttpHeaders.AUTHORIZATION))
        if (token.isNullOrBlank()) {
            log.debug("WS handshake rejected: missing token")
            response.setStatusCode(HttpStatus.UNAUTHORIZED)
            return false
        }
        if (jwtService.validateToken(token) != TokenValidationResult.VALID) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED)
            return false
        }
        return try {
            val publicId = UUID.fromString(jwtService.getPublicIdFromToken(token))
            val user = userRepository.findByPublicId(publicId)
            if (user == null) {
                response.setStatusCode(HttpStatus.UNAUTHORIZED)
                false
            } else {
                attributes[NotificationWebSocketConfig.USER_ID_ATTR] = user.id
                true
            }
        } catch (e: Exception) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED)
            false
        }
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?,
    ) {
        // no-op
    }

    private fun parseQueryParam(query: String?, name: String): String? {
        if (query.isNullOrBlank()) return null
        return query.split("&").firstNotNullOfOrNull { part ->
            val idx = part.indexOf('=')
            if (idx <= 0) return@firstNotNullOfOrNull null
            val k = part.substring(0, idx)
            if (k != name) return@firstNotNullOfOrNull null
            java.net.URLDecoder.decode(part.substring(idx + 1), Charsets.UTF_8)
        }
    }

    private fun extractBearer(header: String?): String? {
        if (header == null || !header.startsWith("Bearer ")) return null
        return header.substring(7)
    }
}
