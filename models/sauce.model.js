import mongoose from "mongoose";

export const SauceModel = mongoose.model("Sauce", {
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true, min: 1, max: 10 },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});
