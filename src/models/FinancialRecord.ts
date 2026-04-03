import { model, Schema, Types } from "mongoose";
import { recordType } from "../constants/roles";

export interface IFinancialRecord {
  amount: number;
  type: (typeof recordType)[keyof typeof recordType];
  category: string;
  date: Date;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    amount: { type: Number, required: true, min: 1 },
    type: { type: String, enum: Object.values(recordType), required: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

financialRecordSchema.index({ date: -1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ createdBy: 1 });

export const FinancialRecord = model<IFinancialRecord>("FinancialRecord", financialRecordSchema);
