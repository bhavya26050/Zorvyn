import { FinancialRecord, IFinancialRecord } from "../models/FinancialRecord";
import { AppError } from "../middlewares/errorHandler";
import { roles, Role } from "../constants/roles";

interface RecordFilters {
  type?: string;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export const createRecord = async (payload: Omit<IFinancialRecord, "createdAt" | "updatedAt">) => {
  return FinancialRecord.create(payload);
};

const buildRecordFilters = (filters: RecordFilters): Record<string, unknown> => {
  const query: {
    type?: string;
    category?: string;
    createdBy?: string;
    date?: { $gte?: Date; $lte?: Date };
    amount?: { $gte?: number; $lte?: number };
  } = {};

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;

  if (filters.fromDate || filters.toDate) {
    query.date = {};
    if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.date.$lte = new Date(filters.toDate);
  }

  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    query.amount = {};
    if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
    if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
  }

  return query;
};

export const listRecords = async (
  filters: RecordFilters,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: "asc" | "desc",
  userId: string,
  role: Role
) => {
  const query = buildRecordFilters(filters);
  if (role !== roles.admin) {
    query.createdBy = userId;
  }
  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    FinancialRecord.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role"),
    FinancialRecord.countDocuments(query)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getRecordById = async (id: string) => {
  const record = await FinancialRecord.findById(id).populate("createdBy", "name email role");

  if (!record) {
    throw new AppError(404, "Record not found");
  }

  return record;
};

export const updateRecord = async (id: string, payload: Partial<IFinancialRecord>) => {
  const updated = await FinancialRecord.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(
    "createdBy",
    "name email role"
  );

  if (!updated) {
    throw new AppError(404, "Record not found");
  }

  return updated;
};

export const deleteRecord = async (id: string) => {
  const deleted = await FinancialRecord.findByIdAndDelete(id);

  if (!deleted) {
    throw new AppError(404, "Record not found");
  }
};
