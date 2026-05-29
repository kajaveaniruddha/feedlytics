package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.workspace.dto.UsageInfoDto
import com.feedlytics.service.workspace.entity.UsageLimitEntity
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.repository.UsageLimitRepository
import com.feedlytics.service.workspace.service.UsageLimitService
import com.feedlytics.service.workspace.usage.ApiCallEvent
import com.feedlytics.service.workspace.usage.BillingPeriod
import com.feedlytics.service.workspace.usage.FeedbackSubmittedEvent
import com.feedlytics.service.workspace.usage.LimitApproachingEvent
import com.feedlytics.service.workspace.usage.UsageObserver
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class UsageLimitServiceImpl(
    private val usageLimitRepository: UsageLimitRepository,
    private val planLimitStrategyFactory: PlanLimitStrategyFactory,
    private val usageObservers: List<UsageObserver>,
) : UsageLimitService {

    @Transactional(readOnly = true)
    override fun canSubmitFeedback(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.feedbackCount < limits.maxFeedbacksPerMonth
    }

    @Transactional(readOnly = true)
    override fun canMakeApiCall(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.apiCalls < limits.maxApiCallsPerMonth
    }

    @Transactional(readOnly = true)
    override fun canCreateCampaign(workspaceId: Long, plan: PlansEnum): Boolean {
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        return usage.campaignCount < limits.maxCampaigns
    }

    @Transactional
    override fun incrementFeedbackCount(workspaceId: Long, plan: PlansEnum, feedbackId: Long) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val newCount = usage.feedbackCount + 1
        val now = Instant.now()
        usageLimitRepository.incrementFeedbackCount(usage.id, now)
        val event = FeedbackSubmittedEvent(
            workspaceId = workspaceId,
            feedbackId = feedbackId,
            currentCount = newCount,
            limit = limits.maxFeedbacksPerMonth,
            timestamp = now,
        )
        usageObservers.forEach { it.onFeedbackSubmitted(event) }
        notifyLimitApproaching(workspaceId, LIMIT_TYPE_FEEDBACK_MONTHLY, newCount, limits.maxFeedbacksPerMonth)
    }

    @Transactional
    override fun incrementApiCalls(workspaceId: Long, plan: PlansEnum) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val newCount = usage.apiCalls + 1
        val now = Instant.now()
        usageLimitRepository.incrementApiCalls(usage.id, now)
        val event = ApiCallEvent(
            workspaceId = workspaceId,
            currentCount = newCount,
            limit = limits.maxApiCallsPerMonth,
            timestamp = now,
        )
        usageObservers.forEach { it.onApiCallMade(event) }
        notifyLimitApproaching(workspaceId, LIMIT_TYPE_API_CALLS_MONTHLY, newCount, limits.maxApiCallsPerMonth)
    }

    @Transactional
    override fun incrementCampaignCount(workspaceId: Long, plan: PlansEnum) {
        val usage = getOrCreateCurrentPeriodUsage(workspaceId)
        val limits = planLimitStrategyFactory.getStrategy(plan).toPlanLimit()
        val newCount = usage.campaignCount + 1
        val now = Instant.now()
        usageLimitRepository.incrementCampaignCount(usage.id, now)
        notifyLimitApproaching(workspaceId, LIMIT_TYPE_CAMPAIGNS, newCount, limits.maxCampaigns)
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

    private fun notifyLimitApproaching(workspaceId: Long, limitType: String, currentUsage: Int, limit: Int) {
        if (limit <= 0) return
        val percentageUsed = currentUsage.toDouble() / limit.toDouble() * PERCENT_SCALE
        if (percentageUsed < LIMIT_APPROACHING_PERCENT_THRESHOLD) return
        val event = LimitApproachingEvent(
            workspaceId = workspaceId,
            limitType = limitType,
            currentUsage = currentUsage,
            limit = limit,
            percentageUsed = percentageUsed,
        )
        usageObservers.forEach { it.onLimitApproaching(event) }
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
        return BillingPeriod.currentUtcMonthStart()
    }

    companion object {
        private const val PERCENT_SCALE = 100.0
        private const val LIMIT_APPROACHING_PERCENT_THRESHOLD = 80.0
        private const val LIMIT_TYPE_FEEDBACK_MONTHLY = "FEEDBACK_MONTHLY"
        private const val LIMIT_TYPE_API_CALLS_MONTHLY = "API_CALLS_MONTHLY"
        private const val LIMIT_TYPE_CAMPAIGNS = "CAMPAIGNS"
    }
}
