import express from "express";

import { setupMiddlewares } from "@/config/middleware.config.js";
import { setupRoutes } from "@/config/routes.config.js";

import { globalErrorHandler } from "./shared/middlewares/error.middleware.js";

const app = express();

setupMiddlewares(app);
setupRoutes(app);

// Error handler (MUST BE LAST)
app.use(globalErrorHandler);

export { app };
