import { Types } from "mongoose";
import { FinancialRecord } from "../models/FinancialRecord";
import { recordType } from "../constants/roles";

export const getSummary = async (userId: string) => {
  const [result] = await FinancialRecord.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", recordType.income] }, "$amount", 0]
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", recordType.expense] }, "$amount", 0]
          }
        }
      }
    }
  ]);

  const totalIncome = result?.totalIncome ?? 0;
  const totalExpenses = result?.totalExpenses ?? 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  };
};

export const getCategoryBreakdown = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1
      }
    },
    { $sort: { total: -1 } }
  ]);
};

export const getRecentActivity = async (userId: string) => {
  return FinancialRecord.find({ createdBy: userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(10)
    .populate("createdBy", "name email role");
};

export const getTrends = async (userId: string, groupBy: "month" | "week") => {
  const dateGrouping =
    groupBy === "month"
      ? {
          year: { $year: "$date" },
          month: { $month: "$date" }
        }
      : {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" }
        };

  return FinancialRecord.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: { ...dateGrouping, type: "$type" },
        total: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        week: "$_id.week",
        type: "$_id.type",
        total: 1
      }
    },
    {
      $sort: {
        year: 1,
        month: 1,
        week: 1
      }
    }
  ]);
};
