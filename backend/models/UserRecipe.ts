import mongoose, { Document, Schema } from "mongoose";
import type { IRecipe } from "./Recipe";

export interface IUserRecipe extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId | IRecipe;
  savedAt: Date;
  rating?: number;
}

const userRecipeSchema = new Schema<IUserRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

userRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
userRecipeSchema.index({ userId: 1, savedAt: -1 });
userRecipeSchema.index({ recipeId: 1 });

const UserRecipe = mongoose.model<IUserRecipe>("UserRecipe", userRecipeSchema);

export default UserRecipe;
