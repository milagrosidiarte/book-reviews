
import { Schema, model, models, Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  volumeId: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    volumeId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    body: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, volumeId: 1 }, { unique: true });

export default models.Review || model<IReview>("Review", reviewSchema);

