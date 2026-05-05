package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.entity.enums.PlansEnum

/**
 * Service for managing workspace plan changes.
 * Used by cron jobs and subscription webhooks, NOT exposed as API endpoints.
 */
interface WorkspacePlanService {

    /**
     * Downgrades a workspace to FREE plan and enforces the free plan limit for the owner.
     * Called by cron job when subscription expires/cancels.
     * 
     * @param workspaceId Internal workspace ID
     * @return Result containing the new plan (could be ARCHIVED if limit exceeded)
     */
    fun downgradeToFree(workspaceId: Long): DowngradeResult

    /**
     * Upgrades a workspace to a paid plan.
     * Called by subscription webhook on successful payment.
     * 
     * @param workspaceId Internal workspace ID
     * @param newPlan PRO or BUSINESS
     */
    fun upgradePlan(workspaceId: Long, newPlan: PlansEnum)

    /**
     * Restores an ARCHIVED workspace to FREE plan (if limit allows) or to a paid plan.
     * Called when user upgrades an archived workspace.
     * 
     * @param workspaceId Internal workspace ID
     * @param targetPlan The plan to restore to
     * @return true if restored, false if limit still exceeded (for FREE plan)
     */
    fun restoreWorkspace(workspaceId: Long, targetPlan: PlansEnum): Boolean

    /**
     * Enforces the FREE workspace limit for a user.
     * Archives least-used workspaces until count <= MAX_FREE_WORKSPACES_PER_USER.
     * 
     * @param ownerId User ID (owner of workspaces)
     * @return List of workspace IDs that were archived
     */
    fun enforceFreePlanLimit(ownerId: Long): List<Long>

    data class DowngradeResult(
        val workspaceId: Long,
        val previousPlan: PlansEnum,
        val newPlan: PlansEnum,  // FREE or ARCHIVED
        val wasArchived: Boolean,
        val archivedWorkspaceIds: List<Long>  // All workspaces archived during this operation
    )
}
