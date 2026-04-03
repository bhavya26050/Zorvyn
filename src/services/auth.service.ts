import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { signToken } from "../utils/jwt";
import { userStatus } from "../constants/roles";

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.status !== userStatus.active) {
    throw new AppError(403, "User is inactive");
  }

  const token = signToken({
    userId: String(user._id),
    role: user.role,
    status: user.status
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};
