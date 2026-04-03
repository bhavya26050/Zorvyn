import { z } from "zod";
import { roles, userStatus } from "../constants/roles";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,100}$/;

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(strongPasswordRegex, "Password must include uppercase, lowercase, number, and special character"),
  role: z.enum([roles.viewer, roles.analyst, roles.admin]).default(roles.viewer),
  status: z.enum([userStatus.active, userStatus.inactive]).default(userStatus.active)
});

export const updateRoleSchema = z.object({
  role: z.enum([roles.viewer, roles.analyst, roles.admin])
});

export const updateStatusSchema = z.object({
  status: z.enum([userStatus.active, userStatus.inactive])
});
