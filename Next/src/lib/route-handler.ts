import { ApiError } from "./api-error";
import { errorResponse, corsErrorResponse } from "./api-response";

export function createHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options?: { cors?: boolean }
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof ApiError) {
        const respond = options?.cors ? corsErrorResponse : errorResponse;
        return respond(error, error.statusCode);
      }

      console.error("Unhandled error:", error);
      const respond = options?.cors ? corsErrorResponse : errorResponse;
      return respond("Internal server error", 500);
    }
  };
}
