package com.feedlytics.service.workspace.entity

import com.feedlytics.service.common.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "feedbacks_categories")
class FeedbackCategoriesEntity(

    @Column(name="name", nullable=false)
    var name: String = "",

    @Column(name="workspace_id", nullable=false)
    val workspaceId: Long,
): BaseEntity()
