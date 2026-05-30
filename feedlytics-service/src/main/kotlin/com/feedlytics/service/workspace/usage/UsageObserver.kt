package com.feedlytics.service.workspace.usage

interface UsageObserver {
    fun onFeedbackSubmitted(event: FeedbackSubmittedEvent) {}

    fun onApiCallMade(event: ApiCallEvent) {}

    fun onLimitApproaching(event: LimitApproachingEvent) {}
}
