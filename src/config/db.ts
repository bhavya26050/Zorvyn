import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true
    });
    console.log("MongoDB connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    throw new Error(`Failed to connect to MongoDB: ${message}`);
  }
};
