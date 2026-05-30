package com.feedlytics.service.auth.service

import com.feedlytics.service.common.entity.User

interface EmailVerificationService {

    fun createAndSendVerificationEmail(user: User)
    fun verifyEmail(userId: Long, code: String): Boolean
}
