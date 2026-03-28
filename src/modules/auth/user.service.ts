import crypto from "node:crypto";

import { compare } from "bcryptjs";

import { UserLoginEnum, UserRolesEnum } from "@/shared/constants/user.constants.js";
import { ApiError } from "@/shared/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
} from "@/shared/utils/generate-tokens.js";
import { emailVerificationMailgenContent, sendEmail } from "@/shared/utils/mail.js";

import type { LoginDTO, RegisterDTO } from "./dto/auth.dto.js";
import { userRepository } from "./user.repository.js";

type RegisterRequestMeta = {
  protocol: string;
  host: string;
};

class UserService {
  private buildInvalidCredentialsError() {
    return ApiError.unauthorized("Invalid email or password");
  }

  private async generateAccessAndRefreshTokens(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw ApiError.internal("User not found during token generation");
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() });

    await userRepository.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  private buildEmailVerificationUrl(requestMeta: RegisterRequestMeta, token: string) {
    return `${requestMeta.protocol}://${requestMeta.host}/api/v1/users/verify-email/${encodeURIComponent(token)}`;
  }

  private async assignEmailVerificationToken(
    user: Awaited<ReturnType<typeof userRepository.create>>,
    requestMeta: RegisterRequestMeta,
  ) {
    const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = new Date(tokenExpiry);
    await user.save({ validateBeforeSave: false });

    const verificationUrl = this.buildEmailVerificationUrl(requestMeta, unHashedToken);

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      content: emailVerificationMailgenContent(user.username, verificationUrl),
    });

    if (!emailResult.ok) {
      await user.deleteOne();
      throw ApiError.internal("Failed to send verification email. Please try registering again");
    }
  }

  async register(data: RegisterDTO, requestMeta: RegisterRequestMeta) {
    const existing = await userRepository.findByEmailOrUsername(data.email, data.username);

    if (existing) throw ApiError.conflict("User with email or username already exists");

    const user = await userRepository.create({
      username: data.username,
      email: data.email,
      password: data.password,
      loginType: UserLoginEnum.EMAIL_PASSWORD,
      role: UserRolesEnum.USER,
      isEmailVerified: false,
    });

    await this.assignEmailVerificationToken(user, requestMeta);

    const createdUser = await userRepository.findByIdSafe(user._id.toString());

    if (!createdUser) {
      throw ApiError.internal("Something went wrong while creating the user");
    }

    return {
      user: createdUser,
    };
  }

  async login(data: LoginDTO) {
    const user = await userRepository.findByEmailOrUsername(data.email);

    if (!user) {
      throw this.buildInvalidCredentialsError();
    }

    if (user.loginType !== UserLoginEnum.EMAIL_PASSWORD) {
      throw ApiError.badRequest(
        `You have previously registered using ${user.loginType.toLowerCase()}. Please use the ${user.loginType.toLowerCase()} login option.`,
      );
    }

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw this.buildInvalidCredentialsError();
    }

    if (!user.isEmailVerified) {
      throw ApiError.forbidden("Please verify your email before logging in");
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(
      user._id.toString(),
    );

    const loggedInUser = await userRepository.findByIdSafe(user._id.toString());

    if (!loggedInUser) {
      throw ApiError.internal("Something went wrong while logging in the user");
    }

    return {
      loggedInUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, "");
  }

  async verifyEmail(emailVerificationToken: string) {
    const hashedToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex");

    const user = await userRepository.findByEmailVerificationToken(hashedToken);

    if (!user) {
      throw ApiError.badRequest("Token is Invalid or Expired");
    }

    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    return {
      isEmailVerified: true,
    };
  }
}

export const userService = new UserService();
