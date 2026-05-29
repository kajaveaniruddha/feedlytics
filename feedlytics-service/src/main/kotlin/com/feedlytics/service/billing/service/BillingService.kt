package com.feedlytics.service.billing.service

import com.feedlytics.service.billing.dto.request.CheckoutSessionRequest
import com.feedlytics.service.billing.dto.response.BillingInfoResponse
import com.feedlytics.service.billing.dto.response.CheckoutSessionResponse
import com.feedlytics.service.billing.dto.response.PortalSessionResponse
import java.util.UUID

interface BillingService {

    fun getBillingInfo(workspacePublicId: UUID, userId: Long): BillingInfoResponse

    fun createCheckoutSession(
        workspacePublicId: UUID,
        userId: Long,
        request: CheckoutSessionRequest,
        origin: String,
    ): CheckoutSessionResponse

    fun createPortalSession(
        workspacePublicId: UUID,
        userId: Long,
        origin: String,
    ): PortalSessionResponse
}
