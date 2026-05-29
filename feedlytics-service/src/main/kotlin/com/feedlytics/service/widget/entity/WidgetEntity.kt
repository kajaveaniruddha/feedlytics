package com.feedlytics.service.widget.entity

import com.feedlytics.service.common.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(name = "widgets")
class WidgetEntity(
    @Column(name = "workspace_id", nullable = false, unique = true)
    var workspaceId: Long,

    @Column(name = "collect_name", nullable = false)
    var collectName: Boolean,

    @Column(name = "collect_email", nullable = false)
    var collectEmail: Boolean,

    @Convert(converter = WidgetThemeJsonConverter::class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "theme", nullable = false, columnDefinition = "jsonb")
    var theme: WidgetThemeJson,

    @Column(name = "is_active", nullable = false)
    var isActive: Boolean,
) : BaseEntity()
