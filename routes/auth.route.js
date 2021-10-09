import express from "express";
import { UserController } from "../controllers";

const authRoute = express.Router();

authRoute.post("/signup", UserController.create);
authRoute.post("/login", UserController.login);

export { authRoute };
