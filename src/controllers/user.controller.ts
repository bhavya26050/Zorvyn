import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../middlewares/errorHandler";
import { createUser, getUsers, updateUserRole, updateUserStatus } from "../services/user.service";

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created",
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

export const getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched",
      data: users
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return next(new AppError(400, "Invalid user id"));
    }

    const user = await updateUserRole(id, req.body.role);

    return res.status(200).json({
      success: true,
      message: "User role updated",
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return next(new AppError(400, "Invalid user id"));
    }

    const user = await updateUserStatus(id, req.body.status);

    return res.status(200).json({
      success: true,
      message: "User status updated",
      data: user
    });
  } catch (error) {
    return next(error);
  }
};
