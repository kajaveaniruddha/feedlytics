package com.feedlytics.service.workspace.repository

import com.feedlytics.service.workspace.entity.UsageLimitEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant

interface UsageLimitRepository : JpaRepository<UsageLimitEntity, Long> {

    fun findByWorkspaceIdAndPeriodStart(workspaceId: Long, periodStart: Instant): UsageLimitEntity?

    @Modifying
    @Query("UPDATE UsageLimitEntity u SET u.feedbackCount = u.feedbackCount + 1, u.updatedAt = :now WHERE u.id = :id")
    fun incrementFeedbackCount(@Param("id") id: Long, @Param("now") now: Instant)

    @Modifying
    @Query("UPDATE UsageLimitEntity u SET u.apiCalls = u.apiCalls + 1, u.updatedAt = :now WHERE u.id = :id")
    fun incrementApiCalls(@Param("id") id: Long, @Param("now") now: Instant)

    @Modifying
    @Query("UPDATE UsageLimitEntity u SET u.campaignCount = u.campaignCount + 1, u.updatedAt = :now WHERE u.id = :id")
    fun incrementCampaignCount(@Param("id") id: Long, @Param("now") now: Instant)

    @Modifying
    @Query("UPDATE UsageLimitEntity u SET u.campaignCount = u.campaignCount - 1, u.updatedAt = :now WHERE u.id = :id AND u.campaignCount > 0")
    fun decrementCampaignCount(@Param("id") id: Long, @Param("now") now: Instant)
}
