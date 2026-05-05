package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.workspace.config.PlanLimits
import com.feedlytics.service.workspace.dto.UsageInfoDto
import com.feedlytics.service.workspace.entity.UsageLimitEntity
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.repository.UsageLimitRepository
import com.feedlytics.service.workspace.service.UsageLimitService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.time.temporal.TemporalAdjusters

@Service
class UsageLimitServiceImpl(
    private val usageLimitRepository: UsageLimitRepository
) : UsageLimitService {

    @Transactional(readOnly = true)
    override fun canSubmitFeedback(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = PlanLimits.forPlan(plan)
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.feedbackCount < limits.maxFeedbacksPerMonth
    }

    @Transactional(readOnly = true)
    override fun canMakeApiCall(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = PlanLimits.forPlan(plan)
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.apiCalls < limits.maxApiCallsPerMonth
    }

    @Transactional(readOnly = true)
    override fun canCreateCampaign(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = PlanLimits.forPlan(plan)
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.campaignCount < limits.maxCampaigns
    }

    @Transactional
    override fun incrementFeedbackCount(workspaceId: Long) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        usageLimitRepository.incrementFeedbackCount(usage.id, Instant.now())
    }

    @Transactional
    override fun incrementApiCalls(workspaceId: Long) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        usageLimitRepository.incrementApiCalls(usage.id, Instant.now())
    }

    @Transactional
    override fun incrementCampaignCount(workspaceId: Long) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        usageLimitRepository.incrementCampaignCount(usage.id, Instant.now())
    }

    @Transactional
    override fun decrementCampaignCount(workspaceId: Long) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        usageLimitRepository.decrementCampaignCount(usage.id, Instant.now())
    }

    @Transactional(readOnly = true)
    override fun getCurrentUsage(workspaceId: Long): UsageInfoDto {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return UsageInfoDto(
            feedbackCount = usage.feedbackCount,
            apiCalls = usage.apiCalls,
            campaignCount = usage.campaignCount,
            periodStart = usage.periodStart
        )
    }

    private fun getOrCreateCurrentPeriodUsage(workspaceId: Long): UsageLimitEntity {
        val periodStart = getCurrentPeriodStart()

        return usageLimitRepository.findByWorkspaceIdAndPeriodStart(workspaceId, periodStart)
            ?: usageLimitRepository.save(
                UsageLimitEntity(
                    workspaceId = workspaceId,
                    periodStart = periodStart
                )
            )
    }

    private fun getCurrentPeriodStart(): Instant {
        return Instant.now()
            .atZone(ZoneOffset.UTC)
            .with(TemporalAdjusters.firstDayOfMonth())
            .toLocalDate()
            .atStartOfDay(ZoneOffset.UTC)
            .toInstant()
    }
}
