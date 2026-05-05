package com.feedlytics.service.feedback.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.feedback.dto.request.CreateFeedbackCategoryRequest
import com.feedlytics.service.feedback.dto.request.UpdateFeedbackCategoryRequest
import com.feedlytics.service.feedback.dto.response.FeedbackCategoryListResponse
import com.feedlytics.service.feedback.dto.response.FeedbackCategoryResponse
import com.feedlytics.service.feedback.service.FeedbackCategoriesManagementService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces/{workspacePublicId}/feedback-categories")
class FeedbackCategoriesController(
    private val categoriesManagement: FeedbackCategoriesManagementService,
) {

    @GetMapping
    fun list(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ): FeedbackCategoryListResponse =
        categoriesManagement.listForMember(workspacePublicId, user.id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
        @Valid @RequestBody body: CreateFeedbackCategoryRequest,
    ): FeedbackCategoryResponse =
        categoriesManagement.createForMember(workspacePublicId, user.id, body)

    @PutMapping("/{categoryId}")
    fun update(
        @PathVariable workspacePublicId: UUID,
        @PathVariable categoryId: Long,
        @AuthenticationPrincipal user: AuthenticatedUser,
        @Valid @RequestBody body: UpdateFeedbackCategoryRequest,
    ): FeedbackCategoryResponse =
        categoriesManagement.updateForMember(workspacePublicId, categoryId, user.id, body)

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable workspacePublicId: UUID,
        @PathVariable categoryId: Long,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ) {
        categoriesManagement.deleteForMember(workspacePublicId, categoryId, user.id)
    }
}
