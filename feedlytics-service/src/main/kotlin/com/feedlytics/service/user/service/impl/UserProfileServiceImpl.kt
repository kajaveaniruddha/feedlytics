package com.feedlytics.service.user.service.impl

import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.user.dto.response.UserProfileData
import com.feedlytics.service.user.dto.response.UserProfileResponse
import com.feedlytics.service.user.service.UserProfileService
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UserProfileServiceImpl(
    private val userRepository: UserRepository
) : UserProfileService {

    override fun getUserProfile(publicId: UUID): UserProfileResponse {
        val user = userRepository.findByPublicId(publicId)
            ?: throw NotFoundException("USER_NOT_FOUND", "User not found")

        return UserProfileResponse(
            user = UserProfileData(
                publicId = user.publicId,
                email = user.email,
                name = user.name,
                avatarUrl = user.avatarUrl,
                isEmailVerified = user.isEmailVerified,
                createdAt = user.createdAt,
                updatedAt = user.updatedAt
            )
        )
    }
}
