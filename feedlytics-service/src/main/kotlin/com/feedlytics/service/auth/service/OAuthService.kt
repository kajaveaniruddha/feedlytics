package com.feedlytics.service.auth.service

import com.feedlytics.service.auth.dto.response.AuthOutcome

interface OAuthService {
    fun authenticate(provider: String, idToken: String, inviteToken: String?): AuthOutcome
}
