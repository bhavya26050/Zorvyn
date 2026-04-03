import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role, UserStatus } from "../constants/roles";

interface TokenPayload {
  userId: string;
  role: Role;
  status: UserStatus;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};
