import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { Role, userStatus } from "../constants/roles";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid authorization token"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

export const requireActiveUser = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, "Unauthorized"));
  }

  if (req.user.status !== userStatus.active) {
    return next(new AppError(403, "Inactive users cannot perform this action"));
  }

  return next();
};

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, "You are not allowed to perform this action"));
    }

    return next();
  };
};
