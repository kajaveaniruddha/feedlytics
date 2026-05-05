import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./api-error";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = fieldErrors[path] || [];
        fieldErrors[path].push(err.message);
      });
      throw AppError.badRequest("Validation failed", fieldErrors);
    }
    req.body = result.data;
    next();
  };
}
