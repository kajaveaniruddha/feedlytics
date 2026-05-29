package com.feedlytics.service.feedback.auth

import com.feedlytics.service.common.exception.ForbiddenException

abstract class BaseAuthHandler : FeedbackAuthHandler {
    private var nextHandler: FeedbackAuthHandler? = null

    override fun setNext(handler: FeedbackAuthHandler): FeedbackAuthHandler {
        nextHandler = handler
        return handler
    }

    override fun handle(request: FeedbackAuthRequest): AuthResult {
        if (canHandle(request)) {
            try {
                when (val result = authenticate(request)) {
                    is AuthResult.Success -> return result
                    is AuthResult.Failure -> { /* try next */ }
                }
            } catch (ex: ForbiddenException) {
                throw ex
            }
        }
        return nextHandler?.handle(request)
            ?: AuthResult.Failure("No valid authentication method found")
    }
}
