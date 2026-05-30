package com.feedlytics.service.auth.entity

import com.feedlytics.service.common.entity.BaseEntity
import com.feedlytics.service.common.entity.enums.AuthProviders
import jakarta.persistence.*

@Entity
@Table(name = "linked_accounts")
class LinkedAccount(
    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val provider: AuthProviders,

    @Column(name = "provider_user_id", nullable = false)
    val providerUserId: String

) : BaseEntity()
