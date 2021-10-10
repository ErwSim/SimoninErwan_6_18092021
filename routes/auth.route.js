import express from "express";
import { UserController } from "../controllers";
import { authMiddleWare, userIdMiddleWare } from "../middlewares";
import { UserModel } from "../models";

const authRoute = express.Router();

authRoute.post("/signup", UserController.create);
authRoute.post("/login", UserController.login);
authRoute.delete(
  "/anonymize",
  authMiddleWare,
  userIdMiddleWare(UserModel),
  UserController.anonymize
); // Used for RGPD compliancy, not yet used by frontend

export { authRoute };
