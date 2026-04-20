import { ApiError } from "./api-error";
import { errorResponse, corsErrorResponse } from "./api-response";

interface HandlerOptions {
  cors?: boolean;
}

export function createHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options?: HandlerOptions
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof ApiError) {
        const respond = options?.cors ? corsErrorResponse : errorResponse;
        const extra = error.fieldErrors ? { errors: error.fieldErrors } : undefined;
        return respond(error.message, error.statusCode, extra);
      }

      console.error("Unhandled error:", error);
      const respond = options?.cors ? corsErrorResponse : errorResponse;
      return respond("Internal server error", 500);
    }
  };
}
