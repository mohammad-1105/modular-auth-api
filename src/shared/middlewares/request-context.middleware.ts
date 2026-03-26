import { randomUUID } from "node:crypto";

import { Request, Response, NextFunction } from "express";

import { requestContext } from "../context/request-context.js";

/**
 * Express middleware to initialize request context.
 *
 * PURPOSE:
 * - Assign a unique requestId to every incoming HTTP request.
 * - Bind that requestId to AsyncLocalStorage so it's accessible everywhere downstream.
 *
 * WHY THIS MATTERS:
 * - Enables request tracing across layers (controller → service → DB → logger)
 * - Critical for debugging in concurrent systems
 * - Helps correlate logs in distributed systems
 */
export const requestContextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  /**
   * Generate a unique identifier for the request.
   *
   * WHY:
   * - Helps track a request across logs and services
   * - Essential in production debugging and observability
   */
  const requestId = randomUUID();

  /**
   * Create a new async context for this request.
   *
   * Everything inside this callback shares the same context.
   */
  requestContext.run({ requestId }, () => {
    /**
     * Attach requestId to req object (optional).
     *
     * WHY:
     * - Useful for debugging or logging at controller level
     * - Not required if consistently using AsyncLocalStorage
     *
     * NOTE:
     * - This is a fallback, not the primary mechanism
     */
    (req as any).requestId = requestId;

    /**
     * Pass control to next middleware / route handler.
     *
     * IMPORTANT:
     * - Must be called inside `run()` so downstream code
     *   executes within the same async context.
     */
    next();
  });
};
