package com.feedlytics.service.user.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.user.dto.response.UserProfileResponse
import com.feedlytics.service.user.service.UserProfileService
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

    @GetMapping("/profile")
    fun getCurrentUser(@AuthenticationPrincipal user: AuthenticatedUser): ResponseEntity<UserProfileResponse> {
        val response = userProfileService.getUserProfile(user.publicId)
        return ResponseEntity.ok(response)
    }
}
