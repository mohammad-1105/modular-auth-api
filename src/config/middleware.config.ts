import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";

import { morganMiddleware } from "@/shared/logger/morgan.middleware.js";
import { globalErrorHandler } from "@/shared/middlewares/error.middleware.js";
import { requestContextMiddleware } from "@/shared/middlewares/request-context.middleware.js";

import { limiter } from "./rate-limit.config.js";
import { helmetConfig, corsConfig } from "./security.config.js";

export const setupMiddlewares = (app: Express) => {
  // -------------------------------
  // Core Context (MUST BE FIRST)
  // -------------------------------
  app.use(requestContextMiddleware);

  // -------------------------------
  // Security
  // -------------------------------
  app.use(helmetConfig);
  app.use(corsConfig);

  // -------------------------------
  // Logging
  // -------------------------------
  app.use(morganMiddleware);

  // -------------------------------
  // Body parsing
  // -------------------------------
  app.use(express.json({ limit: "50kb" }));
  app.use(express.urlencoded({ extended: true, limit: "50kb" }));

  // -------------------------------
  // Cookies
  // -------------------------------
  app.use(cookieParser());

  // -------------------------------
  // Rate limiting (API only)
  // -------------------------------
  app.use("/api", limiter);

  // -------------------------------
  // Static files
  // -------------------------------
  app.use(express.static("public"));

  // -------------------------------
  // Error handler (MUST BE LAST)
  // -------------------------------
  app.use(globalErrorHandler);
};
