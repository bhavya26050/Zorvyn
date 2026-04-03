import { NextFunction, Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    return next(error);
  }
};
