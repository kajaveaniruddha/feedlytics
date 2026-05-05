package com.feedlytics.service.workspace.entity

import com.feedlytics.service.common.entity.BasePublicEntity
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import jakarta.persistence.*

@Entity
@Table(name = "workspaces")
class WorkspacesEntity(
    @Column(nullable = false)
    var name: String,

    @Column(length = 500)
    var description: String? = null,

    @Column(name = "owner_id", nullable = false)
    var ownerId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var plan: PlansEnum = PlansEnum.FREE,

    @Column(name = "api_key_hash", length = 255)
    var apiKeyHash: String? = null,

    @Column(name = "widget_secret_hash", length = 255)
    var widgetSecretHash: String? = null,

    /** JSON array of allowed Origin values, e.g. ["https://example.com","http://localhost:3000"] */
    @Column(name = "widget_allowed_origins", columnDefinition = "TEXT")
    var widgetAllowedOrigins: String? = null,

) : BasePublicEntity()
