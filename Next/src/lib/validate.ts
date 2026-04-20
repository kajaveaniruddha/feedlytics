import { z } from "zod";
import { ApiError } from "./api-error";

export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    });

    throw ApiError.badRequest("Validation failed.", fieldErrors);
  }

  return result.data;
}

export function validateQuery<T>(url: URL, schema: z.ZodSchema<T>): T {
  const params = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    });

    throw ApiError.badRequest("Invalid query parameters.", fieldErrors);
  }

  return result.data;
}
