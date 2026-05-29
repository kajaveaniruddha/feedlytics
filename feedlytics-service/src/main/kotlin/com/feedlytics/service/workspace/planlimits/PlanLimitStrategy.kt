package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum

interface PlanLimitStrategy {
    val planType: PlansEnum

    fun toPlanLimit(): PlanLimit

    fun isAccessible(): Boolean
}
