package com.feedlytics.service.workspace.archive

import com.feedlytics.service.workspace.entity.WorkspacesEntity

interface WorkspaceArchiveStrategy {
    val strategyKey: String

    fun selectWorkspacesToArchive(
        workspaces: List<WorkspacesEntity>,
        targetCount: Int,
    ): List<WorkspacesEntity>
}
