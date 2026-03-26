import express from "express";

import { setupMiddlewares } from "@/config/middleware.config.js";
import { setupRoutes } from "@/config/routes.config.js";

const app = express();

setupMiddlewares(app);
setupRoutes(app);

export { app };
