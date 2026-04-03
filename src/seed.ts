import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { recordType, roles, userStatus } from "./constants/roles";
import { FinancialRecord } from "./models/FinancialRecord";
import { User } from "./models/User";

const runSeed = async () => {
  if (env.nodeEnv === "production") {
    throw new Error("Seeding is disabled in production");
  }

  if (process.env.ALLOW_SEED_RESET !== "true") {
    throw new Error("Refusing to seed. Set ALLOW_SEED_RESET=true to acknowledge destructive reset.");
  }

  await connectDb();

  await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const [admin, analyst, viewer] = await User.create([
    {
      name: "Admin User",
      email: "admin@zorvyn.com",
      password: passwordHash,
      role: roles.admin,
      status: userStatus.active
    },
    {
      name: "Analyst User",
      email: "analyst@zorvyn.com",
      password: passwordHash,
      role: roles.analyst,
      status: userStatus.active
    },
    {
      name: "Viewer User",
      email: "viewer@zorvyn.com",
      password: passwordHash,
      role: roles.viewer,
      status: userStatus.active
    }
  ]);

  await FinancialRecord.create([
    {
      amount: 150000,
      type: recordType.income,
      category: "Salary",
      date: new Date("2026-03-01"),
      notes: "Monthly salary",
      createdBy: admin._id
    },
    {
      amount: 25000,
      type: recordType.expense,
      category: "Rent",
      date: new Date("2026-03-03"),
      notes: "House rent",
      createdBy: admin._id
    },
    {
      amount: 12000,
      type: recordType.expense,
      category: "Utilities",
      date: new Date("2026-03-05"),
      notes: "Electricity and internet",
      createdBy: analyst._id
    },
    {
      amount: 30000,
      type: recordType.income,
      category: "Freelance",
      date: new Date("2026-03-12"),
      notes: "Project payout",
      createdBy: analyst._id
    },
    {
      amount: 5000,
      type: recordType.expense,
      category: "Food",
      date: new Date("2026-03-15"),
      notes: "Groceries",
      createdBy: viewer._id
    }
  ]);

  console.log("Seed completed");
  console.log("Users created: admin@zorvyn.com, analyst@zorvyn.com, viewer@zorvyn.com");
  console.log("Default password for all seed users: Password@123");
};

runSeed().catch(async (error) => {
  console.error("Seed failed", error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.connection.close();
});
