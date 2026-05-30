package com.feedlytics.service.auth.repository

import com.feedlytics.service.auth.entity.LinkedAccount
import com.feedlytics.service.common.entity.enums.AuthProviders
import org.springframework.data.jpa.repository.JpaRepository

interface LinkedAccountRepository : JpaRepository<LinkedAccount, Long> {

    fun findByProviderAndProviderUserId(provider: AuthProviders, providerUserId: String): LinkedAccount?

    fun existsByUserIdAndProvider(userId: Long, provider: AuthProviders): Boolean
}
