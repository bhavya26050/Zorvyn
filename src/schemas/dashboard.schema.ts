import { z } from "zod";

export const trendsQuerySchema = z.object({
  groupBy: z.enum(["month", "week"]).default("month")
});
