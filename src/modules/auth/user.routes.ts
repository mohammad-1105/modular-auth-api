import { Router } from "express";

import { UserRolesEnum } from "@/shared/constants/user.constants.js";
import { verifyJWT, verifyPermission } from "@/shared/middlewares/auth.middleware.js";
import { validateRequest } from "@/shared/middlewares/validate.middleware.js";

import {
  assignRoleSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordParamsSchema,
  resetPasswordSchema,
  userIdParamsSchema,
  verifyEmailParamsSchema,
} from "./dto/auth.dto.js";
import { userController } from "./user.controller.js";

const router = Router();

// Public routes (api/v1/users)
router.post("/register", validateRequest({ body: registerSchema }), userController.register);
router.post("/login", validateRequest({ body: loginSchema }), userController.login);
router.post("/refresh-token", userController.refreshAccessToken);
router.get(
  "/verify-email/:verificationToken",
  validateRequest({ params: verifyEmailParamsSchema }),
  userController.verifyEmail,
);
router.post(
  "/forgot-password",
  validateRequest({ body: forgotPasswordSchema }),
  userController.forgotPassword,
);
router.post(
  "/reset-password/:resetToken",
  validateRequest({
    params: resetPasswordParamsSchema,
    body: resetPasswordSchema,
  }),
  userController.resetForgottenPassword,
);

// Protected routes
router.post("/logout", verifyJWT, userController.logout);
router.get("/current-user", verifyJWT, userController.getCurrentUser);
router.post(
  "/change-password",
  verifyJWT,
  validateRequest({ body: changePasswordSchema }),
  userController.changePassword,
);
router.post("/resend-email-verification", verifyJWT, userController.resendEmailVerification);
router.patch(
  "/assign-role/:userId",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  validateRequest({
    params: userIdParamsSchema,
    body: assignRoleSchema,
  }),
  userController.assignRole,
);

export default router;
