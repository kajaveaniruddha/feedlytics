package com.feedlytics.service.common.entity.enums

enum class AuthProviders(val value: String) {
    GOOGLE("google"),
    GITHUB("github");

    companion object {
        private val map = entries.associateBy { it.value }

        fun fromValue(value: String): AuthProviders? = map[value]
    }
}
