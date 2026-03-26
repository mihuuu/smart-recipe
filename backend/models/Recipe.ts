import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  prepTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  calories?: string;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  tips: string[];
  generatedFrom: string[];
}

const recipeSchema = new Schema<IRecipe>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prepTime: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
    calories: {
      type: String,
    },
    tags: [{ type: String }],
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    tips: [{ type: String }],
    generatedFrom: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        ret._id = undefined;
        ret.__v = undefined;
        return ret;
      },
    },
  }
);

recipeSchema.index({ title: 1 });
recipeSchema.index({ createdBy: 1, createdAt: -1 });

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default Recipe;
