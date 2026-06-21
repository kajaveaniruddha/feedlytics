package com.feedlytics.service.billing.repository

import com.feedlytics.service.billing.entity.WorkspaceSubscriptionEntity
import org.springframework.data.jpa.repository.JpaRepository

interface WorkspaceSubscriptionRepository : JpaRepository<WorkspaceSubscriptionEntity, Long> {

    /** Prefer [findByStripeSubscriptionId]; use this only when workspace has no Stripe sub id (legacy rows). */
    fun findFirstByWorkspaceIdOrderByUpdatedAtDesc(workspaceId: Long): WorkspaceSubscriptionEntity?

    fun findByStripeSubscriptionId(stripeSubscriptionId: String): WorkspaceSubscriptionEntity?
}
