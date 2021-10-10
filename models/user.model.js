import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import validator from "email-validator";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.validate, "invalidEmail"],
  },
  password: { type: String, required: true },
});

userSchema.plugin(mongooseUniqueValidator);

export const UserModel = mongoose.model("User", userSchema);
