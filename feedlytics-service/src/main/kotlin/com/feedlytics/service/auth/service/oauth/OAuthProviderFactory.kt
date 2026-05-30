package com.feedlytics.service.auth.service.oauth

import com.feedlytics.service.common.entity.enums.AuthProviders
import com.feedlytics.service.common.exception.BadRequestException
import org.springframework.stereotype.Component

@Component
class OAuthProviderFactory(
    providers: List<OAuthProvider>
) {
    private val providerMap: Map<AuthProviders, OAuthProvider> =
        providers.associateBy { it.providerName }

    fun getProvider(providerName: String): OAuthProvider {
        val provider = AuthProviders.fromValue(providerName)
            ?: throw BadRequestException(
                "UNSUPPORTED_PROVIDER",
                "OAuth provider '$providerName' is not supported. Supported: ${getSupportedProviders()}"
            )

        return providerMap[provider]
            ?: throw BadRequestException(
                "PROVIDER_NOT_CONFIGURED",
                "OAuth provider '$providerName' is not configured"
            )
    }

    fun getSupportedProviders(): List<String> = providerMap.keys.map { it.value }
}
