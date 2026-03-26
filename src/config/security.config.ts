import cors from "cors";
import helmet from "helmet";

import { env } from "@/config/env.js";

export const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts:
    env.NODE_ENV === "production"
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
});

export const corsConfig = cors({
  origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN?.split(","),
  credentials: true,
});
