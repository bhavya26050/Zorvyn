import { z } from "zod";
import { recordType } from "../constants/roles";

const amountSchema = z
  .number()
  .positive()
  .refine((value) => Number.isFinite(value) && Math.round(value * 100) === value * 100, {
    message: "Amount can have up to 2 decimal places"
  });

export const createRecordSchema = z.object({
  amount: amountSchema,
  type: z.enum([recordType.income, recordType.expense]),
  category: z.string().trim().min(1).max(80),
  date: z.coerce.date(),
  notes: z.string().trim().max(500).optional()
});

export const updateRecordSchema = createRecordSchema.partial();

export const listRecordsQuerySchema = z.object({
  type: z.enum([recordType.income, recordType.expense]).optional(),
  category: z.string().trim().min(1).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["date", "amount", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
})
  .refine((query) => (!query.fromDate || !query.toDate ? true : query.fromDate <= query.toDate), {
    message: "fromDate cannot be after toDate",
    path: ["fromDate"]
  })
  .refine((query) => (!query.minAmount || !query.maxAmount ? true : query.minAmount <= query.maxAmount), {
    message: "minAmount cannot be greater than maxAmount",
    path: ["minAmount"]
  });
