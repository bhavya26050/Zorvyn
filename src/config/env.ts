import dotenv from "dotenv";

dotenv.config();

const requiredKeys = ["MONGO_URI", "JWT_SECRET"] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  corsOrigins: (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};

if (Number.isNaN(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error("PORT must be a valid TCP port between 1 and 65535");
}

if (env.nodeEnv === "production" && env.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}
