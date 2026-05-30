package com.feedlytics.service.common.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
class User(
    @Column(nullable = false, unique = true)
    var email: String,

    @Column(name = "password_hash")
    var passwordHash: String? = null,

    @Column(nullable = false)
    var name: String,

    @Column(name = "avatar_url")
    var avatarUrl: String? = null,

    @Column(name = "is_email_verified", nullable = false)
    var isEmailVerified: Boolean = false

) : BasePublicEntity()
