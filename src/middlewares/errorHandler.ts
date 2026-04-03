import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.issues
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier or value",
      code: "CAST_ERROR"
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Model validation failed",
      code: "MODEL_VALIDATION_ERROR",
      details: Object.values(err.errors).map((item) => item.message)
    });
  }

  if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key error",
      code: "DUPLICATE_KEY"
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: "APP_ERROR"
    });
  }

  if (err instanceof Error) {
    console.error("Unhandled error", {
      message: err.message,
      stack: err.stack
    });
  } else {
    console.error("Unhandled non-error thrown", err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR"
  });
};
