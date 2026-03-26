import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserPreferences {
  complexity: string[];
  spice: string[];
  dietary: string[];
  cuisine: string[];
  meal: string[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  preferences: IUserPreferences;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      trim: true,
    },
    preferences: {
      complexity: { type: [String], default: [] },
      spice: { type: [String], default: [] },
      dietary: { type: [String], default: [] },
      cuisine: { type: [String], default: [] },
      meal: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
