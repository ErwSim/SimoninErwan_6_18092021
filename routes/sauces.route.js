import express from "express";
import multer from "multer";
import { SauceController } from "../controllers";
import { userIdMiddleWare } from "../middlewares/user-id.middleware";
import { SauceModel } from "../models";

const saucesRoute = express.Router();
const upload = multer({ dest: "images/" });

saucesRoute.get("", SauceController.getAll);
saucesRoute.get("/:id", SauceController.getOne);
saucesRoute.post("", upload.single("image"), SauceController.create);
saucesRoute.put(
  "/:id",
  userIdMiddleWare(SauceModel),
  upload.single("image"),
  SauceController.update
);
saucesRoute.delete(
  "/:id",
  userIdMiddleWare(SauceModel),
  SauceController.delete
);

export { saucesRoute };
