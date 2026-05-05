package com.feedlytics.service.user.service

import com.feedlytics.service.user.dto.response.UserProfileResponse
import java.util.UUID

interface UserProfileService {
    fun getUserProfile(publicId: UUID): UserProfileResponse
}
