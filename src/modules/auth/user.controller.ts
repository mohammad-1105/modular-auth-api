import type { Request, Response } from "express";

import { COOKIE_OPTIONS } from "@/shared/constants/user.constants.js";
import { AuthRequest } from "@/shared/middlewares/auth.middleware.js";
import { ApiResponse } from "@/shared/utils/api-response.js";

import type { LoginDTO, RegisterDTO } from "./dto/auth.dto.js";
import { userService } from "./user.service.js";

type VerifyEmailParams = {
  verificationToken: string;
};

class UserController {
  async register(req: Request<unknown, unknown, RegisterDTO>, res: Response) {
    const { user } = await userService.register(req.body, {
      protocol: req.protocol,
      host: req.get("host") ?? "",
    });

    return ApiResponse.created(
      res,
      {
        user,
        isEmailVerificationSent: true,
      },
      "User created successfully. Please verify your email before logging in",
    );
  }

  async login(req: Request<unknown, unknown, LoginDTO>, res: Response) {
    const { loggedInUser, accessToken, refreshToken } = await userService.login(req.body);

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return ApiResponse.success(
      res,
      {
        loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully",
    );
  }

  async logout(req: AuthRequest, res: Response) {
    await userService.logout(req.user!._id.toString());

    res.clearCookie("accessToken", COOKIE_OPTIONS).clearCookie("refreshToken", COOKIE_OPTIONS);

    return ApiResponse.success(res, {}, "User logged out successfully");
  }

  async verifyEmail(req: Request<VerifyEmailParams>, res: Response) {
    const { isEmailVerified } = await userService.verifyEmail(req.params["verificationToken"]);

    return ApiResponse.success(res, { isEmailVerified }, "Email is verified");
  }
}

export const userController = new UserController();
