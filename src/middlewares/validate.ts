import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
};

export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsedQuery = schema.parse(req.query) as Record<string, unknown>;
    Object.assign(req.query as Record<string, unknown>, parsedQuery);
    next();
  };
};
