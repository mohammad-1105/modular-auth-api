import type { Express } from "express";

export const setupRoutes = (app: Express) => {
  // Health check
  app.get("/api/hello", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Hello from server",
    });
  });

  // Feature routes
  // app.use("/api/auth", authRoutes);
};
