package com.feedlytics.service.workspace.archive

import com.feedlytics.service.workspace.entity.WorkspacesEntity
import org.springframework.stereotype.Component

@Component
class LeastUsedArchiveStrategy : WorkspaceArchiveStrategy {
    override val strategyKey: String = "leastUsed"

    override fun selectWorkspacesToArchive(
        workspaces: List<WorkspacesEntity>,
        targetCount: Int,
    ): List<WorkspacesEntity> = workspaces.take(targetCount)
}
