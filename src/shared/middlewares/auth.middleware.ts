import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env.js";
import { userRepository } from "@/modules/auth/user.repository.js";

import { ApiError } from "../utils/api-error.js";

type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof userRepository.findByIdSafe>>>;

export type AuthRequest = Request & {
  user?: AuthenticatedUser;
};

const extractAccessToken = (req: Request) => {
  const authHeader = req.header("Authorization");

  if (authHeader?.match(/^Bearer\s+/i)) {
    return authHeader.replace(/^Bearer\s+/i, "").trim();
  }

  const cookieToken = req.cookies["accessToken"];

  return typeof cookieToken === "string" && cookieToken.length > 0 ? cookieToken : undefined;
};

const getUserIdFromAccessToken = (token: string) => {
  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof (decoded as JwtPayload)["_id"] !== "string"
  ) {
    throw ApiError.unauthorized("Invalid access token");
  }

  return (decoded as JwtPayload & { _id: string })["_id"];
};

const normalizeAuthError = (error: unknown) => {
  return error instanceof ApiError ? error : ApiError.unauthorized("Invalid access token");
};

export const verifyJWT = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = extractAccessToken(req);

    if (!token) {
      return next(ApiError.unauthorized("Unauthorized request"));
    }

    const userId = getUserIdFromAccessToken(token);
    const user = await userRepository.findByIdSafe(userId);

    if (!user) {
      return next(ApiError.unauthorized("Invalid access token"));
    }

    req.user = user;

    return next();
  } catch (error: unknown) {
    return next(normalizeAuthError(error));
  }
};

// For unprotected routes that optionally need user info — fails silently
export const getLoggedInUserOrIgnore = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractAccessToken(req);

  if (!token) {
    return next();
  }

  try {
    const userId = getUserIdFromAccessToken(token);
    const user = await userRepository.findByIdSafe(userId);

    if (user) {
      req.user = user;
    }
  } catch {
    // Intentionally silent — req.user stays undefined
  }

  return next();
};

export const verifyPermission = (roles: string[] = []) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user?._id) {
      return next(ApiError.unauthorized("Unauthorized request"));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You are not allowed to perform this action"));
    }

    return next();
  };
};
