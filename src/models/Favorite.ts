import { Schema, model, models, Types } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    volumeId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, volumeId: 1 }, { unique: true });

export default models.Favorite || model("Favorite", favoriteSchema);
