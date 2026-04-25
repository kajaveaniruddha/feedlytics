export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message = "Bad request", fieldErrors?: Record<string, string[]>) {
    return new AppError(message, 400, fieldErrors);
  }

  static unauthorized(message = "Not authenticated") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message = "Not found") {
    return new AppError(message, 404);
  }

  static internal(message = "Internal server error") {
    return new AppError(message, 500);
  }
}
