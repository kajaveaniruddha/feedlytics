package com.feedlytics.service.feedback.auth

interface FeedbackAuthHandler {
    fun canHandle(request: FeedbackAuthRequest): Boolean

    fun authenticate(request: FeedbackAuthRequest): AuthResult

    fun setNext(handler: FeedbackAuthHandler): FeedbackAuthHandler

    fun handle(request: FeedbackAuthRequest): AuthResult
}
