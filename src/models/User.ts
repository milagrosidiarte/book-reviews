import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export type IUser = {
  _id: string;
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
};

export default models.User || model("User", userSchema);
