import type { Request, Response, NextFunction } from "express";
import { type Options, rateLimit } from "express-rate-limit";

import { ApiError } from "@/shared/utils/api-error.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
  // Express request handler that sends back a response when a client is rate-limited.
  handler: (_req: Request, _res: Response, _next: NextFunction, options: Options) => {
    throw ApiError.tooManyRequests(
      `Too many requests. You are allowed only ${options.limit} requests per ${options.windowMs / 60000} minutes`,
    );
  },
});
