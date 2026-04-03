import { Role, UserStatus } from "../constants/roles";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: Role;
      status: UserStatus;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
