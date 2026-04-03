import { NextFunction, Request, Response } from "express";
import { getCategoryBreakdown, getRecentActivity, getSummary, getTrends } from "../services/dashboard.service";

export const getSummaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getSummary(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Summary fetched",
      data: summary
    });
  } catch (error) {
    return next(error);
  }
};

export const getCategoryBreakdownHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCategoryBreakdown(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Category breakdown fetched",
      data
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentActivityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getRecentActivity(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Recent activity fetched",
      data
    });
  } catch (error) {
    return next(error);
  }
};

export const getTrendsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupBy } = req.query as { groupBy: "month" | "week" };
    const data = await getTrends(req.user!.userId, groupBy);

    return res.status(200).json({
      success: true,
      message: "Trend data fetched",
      data
    });
  } catch (error) {
    return next(error);
  }
};
