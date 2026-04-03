import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { Role, UserStatus } from "../constants/roles";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
}

export const createUser = async (payload: CreateUserInput) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const password = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, email: payload.email.toLowerCase(), password });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const getUsers = async () => {
  return User.find({}, { password: 0 }).sort({ createdAt: -1 });
};

export const updateUserRole = async (id: string, role: Role) => {
  const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true, projection: { password: 0 } });

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  return updatedUser;
};

export const updateUserStatus = async (id: string, status: UserStatus) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true, projection: { password: 0 } }
  );

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  return updatedUser;
};
