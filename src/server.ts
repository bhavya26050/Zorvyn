import app from "./app";
import mongoose from "mongoose";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const bootstrap = async () => {
  await connectDb();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error instanceof Error ? error.message : error);
  process.exit(1);
});
