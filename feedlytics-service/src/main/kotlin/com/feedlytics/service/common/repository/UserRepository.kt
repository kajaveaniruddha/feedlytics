package com.feedlytics.service.common.repository

import com.feedlytics.service.common.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository: JpaRepository<User, Long> {
    fun findByPublicId(publicId: UUID): User?
    fun existsByEmail(email: String): Boolean
    fun findByEmail(email: String): User?
}
