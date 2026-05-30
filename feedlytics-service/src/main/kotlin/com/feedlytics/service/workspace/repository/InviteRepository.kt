package com.feedlytics.service.workspace.repository

import com.feedlytics.service.workspace.entity.InviteEntity
import com.feedlytics.service.workspace.entity.enums.InviteStatusEnum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface InviteRepository : JpaRepository<InviteEntity, UUID> {

    fun findByToken(token: String): InviteEntity?

    fun findAllByWorkspaceIdAndStatus(workspaceId: Long, status: InviteStatusEnum): List<InviteEntity>

    fun findByWorkspaceIdAndEmailAndStatus(
        workspaceId: Long,
        email: String,
        status: InviteStatusEnum
    ): InviteEntity?

    fun findAllByEmailAndStatus(email: String, status: InviteStatusEnum): List<InviteEntity>

    @Modifying
    @Query("UPDATE InviteEntity i SET i.status = :newStatus, i.updatedAt = :now WHERE i.status = 'PENDING' AND i.expiresAt < :now")
    fun expireOldInvites(@Param("newStatus") newStatus: InviteStatusEnum, @Param("now") now: Instant): Int

    @Modifying
    @Query("UPDATE InviteEntity i SET i.status = 'CANCELLED', i.updatedAt = :now WHERE i.id = :id AND i.status = 'PENDING'")
    fun cancelInvite(@Param("id") id: UUID, @Param("now") now: Instant): Int
}
