import mongoose from "mongoose";

export const UserModel = mongoose.model("User", {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
