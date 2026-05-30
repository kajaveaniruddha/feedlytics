package com.feedlytics.service.billing.repository

import com.feedlytics.service.billing.entity.WorkspaceSubscriptionEntity
import org.springframework.data.jpa.repository.JpaRepository

interface WorkspaceSubscriptionRepository : JpaRepository<WorkspaceSubscriptionEntity, Long> {

    fun findByWorkspaceId(workspaceId: Long): WorkspaceSubscriptionEntity?

    fun findByStripeSubscriptionId(stripeSubscriptionId: String): WorkspaceSubscriptionEntity?

    fun findByStripeCustomerId(stripeCustomerId: String): WorkspaceSubscriptionEntity?
}
