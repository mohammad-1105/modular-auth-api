import { env } from "@/config/env.js";
import { ApiError } from "@/shared/utils/api-error.js";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "@/shared/utils/mail.js";

import { type IUser } from "./user.model.js";

const buildEmailVerificationUrl = (token: string) => {
  return new URL(
    `/api/v1/users/verify-email/${encodeURIComponent(token)}`,
    env.API_PUBLIC_URL,
  ).toString();
};

const buildForgotPasswordUrl = (resetToken: string) => {
  if (!env.FORGOT_PASSWORD_REDIRECT_URL) {
    return;
  }

  const normalizedBaseUrl = env.FORGOT_PASSWORD_REDIRECT_URL.replace(/\/+$/, "");

  return `${normalizedBaseUrl}/${encodeURIComponent(resetToken)}`;
};

export const sendEmailVerification = async (user: IUser, verificationToken: string) => {
  const verificationUrl = buildEmailVerificationUrl(verificationToken);
  const emailResult = await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    content: emailVerificationMailgenContent(user.username, verificationUrl),
  });

  if (!emailResult.ok) {
    throw ApiError.internal("Failed to send verification email. Please try registering again");
  }
};

export const sendForgotPasswordEmail = async (user: IUser, resetToken: string) => {
  const passwordResetUrl = buildForgotPasswordUrl(resetToken);
  const emailResult = await sendEmail({
    email: user.email,
    subject: "Password reset request",
    content: forgotPasswordMailgenContent({
      username: user.username,
      resetToken,
      ...(passwordResetUrl
        ? {
            passwordResetUrl,
          }
        : {}),
    }),
  });

  if (!emailResult.ok) {
    throw ApiError.internal("Failed to send password reset email. Please try again");
  }
};
