package com.feedlytics.service.common.config

import com.feedlytics.service.common.security.JwtAuthenticationEntryPoint
import com.feedlytics.service.common.security.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint,
    private val corsProperties: CorsProperties
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    /**
     * Embeddable widget calls the API from arbitrary customer origins (no cookies).
     * These paths use permissive origin patterns; [WidgetSecretAuthHandler] still
     * enforces workspace allowed origins for GET widget and widget send-feedback.
     *
     * Registered before the default catch-all path mapping so they take precedence over the SPA config.
     */
    private fun publicEmbedCorsConfiguration(): CorsConfiguration =
        CorsConfiguration().apply {
            allowedOriginPatterns = listOf("https://*", "http://*")
            allowedMethods = listOf("GET", "POST", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = false
            maxAge = 3600L
        }

    /**
     * CORS must allow credentials so the browser will send / accept the refresh
     * token cookie. With credentials enabled, the spec forbids "*" for origins,
     * so we list the SPA origins explicitly via [CorsProperties.allowedOrigins].
     */
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val spaConfiguration = CorsConfiguration().apply {
            allowedOrigins = corsProperties.allowedOrigins
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            exposedHeaders = listOf("Authorization")
            allowCredentials = true
            maxAge = 3600L
        }
        val embed = publicEmbedCorsConfiguration()
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/v1/workspaces/*/widget", embed)
            registerCorsConfiguration("/api/v1/workspaces/*/send-feedback", embed)
            registerCorsConfiguration("/**", spaConfiguration)
        }
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .exceptionHandling { it.authenticationEntryPoint(jwtAuthenticationEntryPoint) }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/actuator/**",
                        "/api/v1/auth/**",
                        "/api-docs",
                        "/api/v1/workspaces/*/send-feedback",
                        "/api/v1/internal/**",
                        "/internal/**",
                        "/api/v1/webhooks/stripe",
                    ).permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/workspaces/*/widget").permitAll()
                    .anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}
