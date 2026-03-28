import { Router } from "express";

import { verifyJWT } from "@/shared/middlewares/auth.middleware.js";
import { validateRequest } from "@/shared/middlewares/validate.middleware.js";

import { loginSchema, registerSchema, verifyEmailParamsSchema } from "./dto/auth.dto.js";
import { userController } from "./user.controller.js";

const router = Router();

// Public routes (api/v1/users)
router.post("/register", validateRequest({ body: registerSchema }), userController.register);
router.post("/login", validateRequest({ body: loginSchema }), userController.login);
router.get(
  "/verify-email/:verificationToken",
  validateRequest({ params: verifyEmailParamsSchema }),
  userController.verifyEmail,
);

// Protected routes
router.post("/logout", verifyJWT, userController.logout);

export default router;
