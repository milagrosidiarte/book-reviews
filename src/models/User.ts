import { Schema, model, models, type Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default (models.User as any) || model<IUser>("User", userSchema);
