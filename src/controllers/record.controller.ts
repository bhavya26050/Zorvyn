import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { roles } from "../constants/roles";
import { AppError } from "../middlewares/errorHandler";
import { createRecord, deleteRecord, getRecordById, listRecords, updateRecord } from "../services/record.service";

const getOwnerId = (createdBy: unknown): string => {
  if (typeof createdBy === "object" && createdBy !== null && "_id" in createdBy) {
    const populated = createdBy as { _id: unknown };
    return String(populated._id);
  }

  return String(createdBy);
};

export const createRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdBy = req.user!.userId;
    const record = await createRecord({ ...req.body, createdBy });

    return res.status(201).json({
      success: true,
      message: "Record created",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

export const listRecordsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, category, fromDate, toDate, minAmount, maxAmount, page, limit, sortBy, sortOrder } = req.query as unknown as {
      type?: string;
      category?: string;
      fromDate?: Date;
      toDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: "asc" | "desc";
    };

    const data = await listRecords(
      { type, category, fromDate, toDate, minAmount, maxAmount },
      page,
      limit,
      sortBy,
      sortOrder,
      req.user!.userId,
      req.user!.role
    );

    return res.status(200).json({
      success: true,
      message: "Records fetched",
      data
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    if (!isValidObjectId(id)) {
      return next(new AppError(400, "Invalid record id"));
    }

    const record = await getRecordById(id);

    if (req.user!.role !== roles.admin && getOwnerId(record.createdBy) !== req.user!.userId) {
      return next(new AppError(403, "You are not allowed to view this record"));
    }

    return res.status(200).json({
      success: true,
      message: "Record fetched",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    if (!isValidObjectId(id)) {
      return next(new AppError(400, "Invalid record id"));
    }

    const existingRecord = await getRecordById(id);

    if (req.user!.role !== roles.admin && getOwnerId(existingRecord.createdBy) !== req.user!.userId) {
      return next(new AppError(403, "You are not allowed to update this record"));
    }

    const record = await updateRecord(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Record updated",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    if (!isValidObjectId(id)) {
      return next(new AppError(400, "Invalid record id"));
    }

    const existingRecord = await getRecordById(id);

    if (req.user!.role !== roles.admin && getOwnerId(existingRecord.createdBy) !== req.user!.userId) {
      return next(new AppError(403, "You are not allowed to delete this record"));
    }

    await deleteRecord(id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
