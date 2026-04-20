export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message = "Bad request", fieldErrors?: Record<string, string[]>) {
    return new ApiError(message, 400, fieldErrors);
  }

  static unauthorized(message = "Not authenticated") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  static notFound(message = "Not found") {
    return new ApiError(message, 404);
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500);
  }
}
