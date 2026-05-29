package com.feedlytics.service.billing.controller

import com.feedlytics.service.billing.dto.request.CheckoutSessionRequest
import com.feedlytics.service.billing.dto.response.BillingInfoResponse
import com.feedlytics.service.billing.dto.response.CheckoutSessionResponse
import com.feedlytics.service.billing.dto.response.PortalSessionResponse
import com.feedlytics.service.billing.service.BillingService
import com.feedlytics.service.common.security.AuthenticatedUser
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/billing")
class BillingController(
    private val billingService: BillingService,
) {

    @GetMapping
    fun getBillingInfo(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
    ): BillingInfoResponse {
        return billingService.getBillingInfo(workspaceId, user.id)
    }

    @PostMapping("/checkout-session")
    fun createCheckoutSession(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @Valid @RequestBody request: CheckoutSessionRequest,
        httpRequest: HttpServletRequest,
    ): CheckoutSessionResponse {
        val origin = httpRequest.getHeader("Origin")
            ?: httpRequest.getHeader("Referer")?.substringBefore("/", "")
            ?: "http://localhost:3000"
        return billingService.createCheckoutSession(workspaceId, user.id, request, origin)
    }

    @PostMapping("/portal-session")
    fun createPortalSession(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        httpRequest: HttpServletRequest,
    ): PortalSessionResponse {
        val origin = httpRequest.getHeader("Origin")
            ?: httpRequest.getHeader("Referer")?.substringBefore("/", "")
            ?: "http://localhost:3000"
        return billingService.createPortalSession(workspaceId, user.id, origin)
    }
}
