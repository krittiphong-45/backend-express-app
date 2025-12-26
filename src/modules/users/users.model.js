import mongoose from "mongoose";

// a data model is created from a data schema

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  {
    timestamps: true,
  }
);

// mongodb will automatically creat users collection

export const User = mongoose.model("User", userSchema);