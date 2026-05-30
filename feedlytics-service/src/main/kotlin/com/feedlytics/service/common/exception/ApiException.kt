package com.feedlytics.service.common.exception

open class ApiException(val code: String, override val message: String, val status: Int) : RuntimeException(message)

class BadRequestException(code: String, message: String): ApiException(code, message, 400)
class UnauthorizedException(code: String, message: String) : ApiException(code, message, 401)
class ForbiddenException(code: String, message: String) : ApiException(code, message, 403)
class NotFoundException(code: String, message: String) : ApiException(code, message, 404)
class ConflictException(code: String, message: String) : ApiException(code, message, 409)
class LimitExceededException(code: String, message: String) : ApiException(code, message, 429)
