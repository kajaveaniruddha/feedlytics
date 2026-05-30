package com.feedlytics.service.workspace.entity

import com.feedlytics.service.common.entity.BaseEntity
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import jakarta.persistence.*

@Entity
@Table(name = "workspace_members")
class WorkspaceMembersEntity(
    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: WorkspaceRoleEnum,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: MemberStatusEnum = MemberStatusEnum.ACTIVE

) : BaseEntity()
