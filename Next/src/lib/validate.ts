import { z } from "zod";
import { ApiError } from "./api-error";

export async function validateBody<T>(request: Request, schema: z.ZodType<T, any, any>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest("Invalid JSON body");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      fieldErrors[key] = fieldErrors[key] || [];
      fieldErrors[key].push(issue.message);
    }
    throw ApiError.badRequest("Validation failed", fieldErrors);
  }

  return result.data;
}

export function validateQuery<T>(url: URL, schema: z.ZodType<T, any, any>): T {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      fieldErrors[key] = fieldErrors[key] || [];
      fieldErrors[key].push(issue.message);
    }
    throw ApiError.badRequest("Invalid query parameters", fieldErrors);
  }

  return result.data;
}
