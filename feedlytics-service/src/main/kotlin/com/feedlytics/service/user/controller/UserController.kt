package com.feedlytics.service.user.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.user.dto.response.UserProfileResponse
import com.feedlytics.service.user.service.UserProfileService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/users")
class UserController(
    private val userProfileService: UserProfileService
) {

    private val log = LoggerFactory.getLogger(UserController::class.java)

    @GetMapping("/profile")
    fun getCurrentUser(@AuthenticationPrincipal user: AuthenticatedUser): ResponseEntity<UserProfileResponse> {
        log.info("users getProfile userId={}", user.id)
        val response = userProfileService.getUserProfile(user.publicId)
        return ResponseEntity.ok(response)
    }
}
