package com.feedlytics.service.workspace.usage

import java.time.Instant
import java.time.ZoneOffset
import java.time.temporal.TemporalAdjusters

object BillingPeriod {
    fun currentUtcMonthStart(now: Instant = Instant.now()): Instant {
        return now
            .atZone(ZoneOffset.UTC)
            .with(TemporalAdjusters.firstDayOfMonth())
            .toLocalDate()
            .atStartOfDay(ZoneOffset.UTC)
            .toInstant()
    }

    fun nextUtcMonthStart(periodStart: Instant): Instant {
        return periodStart
            .atZone(ZoneOffset.UTC)
            .plusMonths(1)
            .toInstant()
    }
}
