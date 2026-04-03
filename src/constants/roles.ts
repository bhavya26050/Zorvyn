export const roles = {
  viewer: "VIEWER",
  analyst: "ANALYST",
  admin: "ADMIN"
} as const;

export type Role = (typeof roles)[keyof typeof roles];

export const userStatus = {
  active: "ACTIVE",
  inactive: "INACTIVE"
} as const;

export type UserStatus = (typeof userStatus)[keyof typeof userStatus];

export const recordType = {
  income: "INCOME",
  expense: "EXPENSE"
} as const;

export type RecordType = (typeof recordType)[keyof typeof recordType];
