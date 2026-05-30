package com.feedlytics.service.billing.repository

import com.feedlytics.service.billing.entity.BillingAuditLogEntity
import org.springframework.data.jpa.repository.JpaRepository

interface BillingAuditLogRepository : JpaRepository<BillingAuditLogEntity, Long> {

    fun findByWorkspaceIdOrderByCreatedAtDesc(workspaceId: Long): List<BillingAuditLogEntity>
}
