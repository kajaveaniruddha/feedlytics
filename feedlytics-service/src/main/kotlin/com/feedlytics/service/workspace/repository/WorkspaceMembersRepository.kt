package com.feedlytics.service.workspace.repository

import com.feedlytics.service.workspace.dto.MemberWithUserDto
import com.feedlytics.service.workspace.entity.WorkspaceMembersEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface WorkspaceMembersRepository : JpaRepository<WorkspaceMembersEntity, Long> {

    fun findByUserIdAndWorkspaceId(userId: Long, workspaceId: Long): WorkspaceMembersEntity?

    fun findAllByUserId(userId: Long): List<WorkspaceMembersEntity>

    fun findAllByWorkspaceId(workspaceId: Long): List<WorkspaceMembersEntity>

    fun existsByUserIdAndWorkspaceId(userId: Long, workspaceId: Long): Boolean

    fun countByWorkspaceId(workspaceId: Long): Long

    fun findByUserIdAndWorkspaceIdAndRoleIn(
        userId: Long,
        workspaceId: Long,
        roles: List<WorkspaceRoleEnum>
    ): WorkspaceMembersEntity?

    @Query("""
        SELECT new com.feedlytics.service.workspace.dto.MemberWithUserDto(
            wm.id, u.publicId, u.name, u.email, u.avatarUrl, wm.role, wm.status, wm.createdAt
        )
        FROM WorkspaceMembersEntity wm
        JOIN User u ON wm.userId = u.id
        WHERE wm.workspaceId = :workspaceId
        ORDER BY 
            CASE wm.role 
                WHEN 'OWNER' THEN 1 
                WHEN 'ADMIN' THEN 2 
                WHEN 'MEMBER' THEN 3 
            END,
            wm.createdAt ASC
    """)
    fun findAllMembersWithUserByWorkspaceId(@Param("workspaceId") workspaceId: Long): List<MemberWithUserDto>

    @Query("""
        SELECT new com.feedlytics.service.workspace.dto.MemberWithUserDto(
            wm.id, u.publicId, u.name, u.email, u.avatarUrl, wm.role, wm.status, wm.createdAt
        )
        FROM WorkspaceMembersEntity wm
        JOIN User u ON wm.userId = u.id
        WHERE wm.workspaceId = :workspaceId AND u.publicId = :userPublicId
    """)
    fun findMemberWithUserByWorkspaceIdAndUserPublicId(
        @Param("workspaceId") workspaceId: Long,
        @Param("userPublicId") userPublicId: UUID
    ): MemberWithUserDto?

    fun deleteByWorkspaceIdAndUserId(workspaceId: Long, userId: Long)
}
