package com.feedlytics.service.common.security

import com.feedlytics.service.common.repository.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    companion object {
        private const val AUTH_HEADER = "Authorization"
        private const val BEARER_PREFIX = "Bearer "
        const val TOKEN_ERROR_ATTRIBUTE = "TOKEN_ERROR"
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = extractToken(request)
        if (token != null) {
            when (jwtService.validateToken(token)) {
                TokenValidationResult.VALID -> {
                    try {
                        val publicIdStr = jwtService.getPublicIdFromToken(token)
                        val publicId = UUID.fromString(publicIdStr)
                        val user = userRepository.findByPublicId(publicId)

                        if (user != null) {
                            val authenticatedUser = AuthenticatedUser(
                                id = user.id,
                                publicId = user.publicId,
                                email = user.email,
                                name = user.name
                            )

                            val authentication = UsernamePasswordAuthenticationToken(
                                authenticatedUser,
                                null,
                                emptyList()
                            )
                            SecurityContextHolder.getContext().authentication = authentication
                        } else {
                            request.setAttribute(TOKEN_ERROR_ATTRIBUTE, "USER_NOT_FOUND")
                        }
                    } catch (e: Exception) {
                        request.setAttribute(TOKEN_ERROR_ATTRIBUTE, "INVALID_TOKEN")
                        SecurityContextHolder.clearContext()
                    }
                }
                TokenValidationResult.EXPIRED -> {
                    request.setAttribute(TOKEN_ERROR_ATTRIBUTE, "TOKEN_EXPIRED")
                }
                TokenValidationResult.INVALID -> {
                    request.setAttribute(TOKEN_ERROR_ATTRIBUTE, "INVALID_TOKEN")
                }
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader(AUTH_HEADER) ?: return null
        return if (header.startsWith(BEARER_PREFIX)) {
            header.substring(BEARER_PREFIX.length)
        } else {
            null
        }
    }
}
