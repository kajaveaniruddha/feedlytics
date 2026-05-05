package com.feedlytics.service.common.security

import com.feedlytics.service.common.entity.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

enum class TokenValidationResult {
    VALID,
    EXPIRED,
    INVALID
}

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.access-token-expiry}") private val accessTokenExpiry: Long
) {
    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateAccessToken(user: User): String {
        val now = Date()
        val expiry = Date(now.time + (accessTokenExpiry * 1000))

        return Jwts.builder()
            .subject(user.publicId.toString())
            .issuedAt(now)
            .expiration(expiry)
            .signWith(key)
            .compact()
    }

    fun validateToken(token: String): TokenValidationResult {
        return try {
            getClaims(token)
            TokenValidationResult.VALID
        } catch (e: ExpiredJwtException) {
            TokenValidationResult.EXPIRED
        } catch (e: Exception) {
            TokenValidationResult.INVALID
        }
    }

    fun getPublicIdFromToken(token: String): String {
        return getClaims(token).subject
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    fun getAccessTokenExpirySeconds(): Long = accessTokenExpiry
}
