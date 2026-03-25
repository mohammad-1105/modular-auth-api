import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

import { ApiError } from "../utils/api-error.js";

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return ApiError.badRequest("Validation Failed", result.error.flatten);
    }

    req.body = result.data;
    next();
  };
};
