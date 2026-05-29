package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.workspace.archive.WorkspaceArchiveStrategy
import com.feedlytics.service.workspace.planlimits.WorkspaceFreePlanConstants
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.WorkspacePlanService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WorkspacePlanServiceImpl(
    private val workspaceRepository: WorkspaceRepository,
    archiveStrategies: List<WorkspaceArchiveStrategy>,
    @Value("\${workspace.archive.strategy:leastUsed}") archiveStrategyKey: String,
) : WorkspacePlanService {

    private val logger = LoggerFactory.getLogger(WorkspacePlanServiceImpl::class.java)

    private val archiveStrategy: WorkspaceArchiveStrategy =
        archiveStrategies.find { it.strategyKey == archiveStrategyKey }
            ?: archiveStrategies.first()

    @Transactional
    override fun downgradeToFree(workspaceId: Long): WorkspacePlanService.DowngradeResult {
        val workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow { NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found") }

        val previousPlan = workspace.plan

        if (previousPlan == PlansEnum.FREE || previousPlan == PlansEnum.ARCHIVED) {
            logger.warn("Attempted to downgrade workspace {} which is already on {} plan", workspaceId, previousPlan)
            return WorkspacePlanService.DowngradeResult(
                workspaceId = workspaceId,
                previousPlan = previousPlan,
                newPlan = previousPlan,
                wasArchived = previousPlan == PlansEnum.ARCHIVED,
                archivedWorkspaceIds = emptyList()
            )
        }

        workspace.plan = PlansEnum.FREE
        workspaceRepository.save(workspace)

        logger.info("Downgraded workspace {} from {} to FREE", workspaceId, previousPlan)

        // Enforce the limit - might archive this or other workspaces
        val archivedIds = enforceFreePlanLimit(workspace.ownerId)

        // Re-fetch to check if this workspace got archived
        val updatedWorkspace = workspaceRepository.findById(workspaceId).get()

        return WorkspacePlanService.DowngradeResult(
            workspaceId = workspaceId,
            previousPlan = previousPlan,
            newPlan = updatedWorkspace.plan,
            wasArchived = updatedWorkspace.plan == PlansEnum.ARCHIVED,
            archivedWorkspaceIds = archivedIds
        )
    }

    @Transactional
    override fun upgradePlan(workspaceId: Long, newPlan: PlansEnum) {
        if (newPlan != PlansEnum.PRO && newPlan != PlansEnum.BUSINESS) {
            throw BadRequestException("INVALID_PLAN", "Can only upgrade to PRO or BUSINESS")
        }

        val workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow { NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found") }

        val previousPlan = workspace.plan
        workspace.plan = newPlan
        workspaceRepository.save(workspace)

        logger.info("Upgraded workspace {} from {} to {}", workspaceId, previousPlan, newPlan)
    }

    @Transactional
    override fun restoreWorkspace(workspaceId: Long, targetPlan: PlansEnum): Boolean {
        val workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow { NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found") }

        if (workspace.plan != PlansEnum.ARCHIVED) {
            throw BadRequestException("NOT_ARCHIVED", "Workspace is not archived")
        }

        if (targetPlan == PlansEnum.ARCHIVED) {
            throw BadRequestException("INVALID_PLAN", "Cannot restore to ARCHIVED plan")
        }

        // For paid plans, just restore directly
        if (targetPlan == PlansEnum.PRO || targetPlan == PlansEnum.BUSINESS) {
            workspace.plan = targetPlan
            workspaceRepository.save(workspace)
            logger.info("Restored workspace {} to {}", workspaceId, targetPlan)
            return true
        }

        // For FREE plan, check if limit allows
        val currentFreeCount = workspaceRepository.countByOwnerIdAndPlan(workspace.ownerId, PlansEnum.FREE)
        if (currentFreeCount >= WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER) {
            logger.warn("Cannot restore workspace {} to FREE - limit exceeded ({}/{})",
                workspaceId, currentFreeCount, WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER)
            return false
        }

        workspace.plan = PlansEnum.FREE
        workspaceRepository.save(workspace)
        logger.info("Restored workspace {} to FREE", workspaceId)
        return true
    }

    @Transactional
    override fun enforceFreePlanLimit(ownerId: Long): List<Long> {
        val freeWorkspaces = workspaceRepository.findFreeWorkspacesByOwnerOrderedByUsage(ownerId)
        val archivedIds = mutableListOf<Long>()

        if (freeWorkspaces.size <= WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER) {
            return archivedIds
        }

        val countToArchive = freeWorkspaces.size - WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER

        val toArchive = archiveStrategy.selectWorkspacesToArchive(freeWorkspaces, countToArchive)
        toArchive.forEach { workspace ->
            workspace.plan = PlansEnum.ARCHIVED
            workspaceRepository.save(workspace)
            archivedIds.add(workspace.id)
            logger.info("Archived workspace {} (owner: {}) due to free plan limit", workspace.id, ownerId)
        }

        return archivedIds
    }
}
