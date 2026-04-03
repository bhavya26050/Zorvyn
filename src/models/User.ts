import { model, Schema } from "mongoose";
import { roles, userStatus } from "../constants/roles";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: (typeof roles)[keyof typeof roles];
  status: (typeof userStatus)[keyof typeof userStatus];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.viewer,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(userStatus),
      default: userStatus.active,
      required: true
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
