package com.feedlytics.service.workspace.repository

import com.feedlytics.service.workspace.dto.WorkspaceWithRoleDto
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface WorkspaceRepository : JpaRepository<WorkspacesEntity, Long> {

    fun findByPublicId(publicId: UUID): WorkspacesEntity?

    fun findByStripeCustomerId(stripeCustomerId: String): WorkspacesEntity?

    @Query(
        """
        SELECT new com.feedlytics.service.workspace.dto.WorkspaceWithRoleDto(
            w.id,
            w.publicId,
            w.name,
            w.description,
            w.plan,
            w.ownerId,
            w.createdAt,
            wm.role,
            wm.status,
            (SELECT COUNT(wm2.id) FROM WorkspaceMembersEntity wm2 WHERE wm2.workspaceId = w.id),
            COALESCE((SELECT AVG(f.rating) FROM FeedbacksEntity f WHERE f.workspaceId = w.id), 0.0),
            (SELECT COUNT(f2.id) FROM FeedbacksEntity f2 WHERE f2.workspaceId = w.id)
        )
        FROM WorkspacesEntity w
        JOIN WorkspaceMembersEntity wm ON w.id = wm.workspaceId
        WHERE wm.userId = :userId
        """
    )
    fun findAllByMemberUserId(@Param("userId") userId: Long): List<WorkspaceWithRoleDto>

    fun countByOwnerIdAndPlan(ownerId: Long, plan: com.feedlytics.service.workspace.entity.enums.PlansEnum): Long

    @Query("""
        SELECT w FROM WorkspacesEntity w
        LEFT JOIN UsageLimitEntity u ON w.id = u.workspaceId
        WHERE w.ownerId = :ownerId AND w.plan = 'FREE'
        ORDER BY COALESCE(u.feedbackCount, 0) ASC, w.createdAt ASC
    """)
    fun findFreeWorkspacesByOwnerOrderedByUsage(@Param("ownerId") ownerId: Long): List<WorkspacesEntity>
}
