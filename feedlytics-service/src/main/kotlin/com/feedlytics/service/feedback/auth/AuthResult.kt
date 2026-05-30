package com.feedlytics.service.feedback.auth

import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum

sealed class AuthResult {
    data class Success(val sourceType: SourceTypeEnum) : AuthResult()

    data class Failure(val reason: String) : AuthResult()
}
