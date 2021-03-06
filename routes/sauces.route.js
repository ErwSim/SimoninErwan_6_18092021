import express from "express";
import multer from "multer";
import { SauceController } from "../controllers";
import { userIdMiddleWare } from "../middlewares";
import { SauceModel } from "../models";

const saucesRoute = express.Router();
const upload = multer({
  dest: "images/",
  fileFilter: (req, file, cb) => {
    const acceptedMimes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];

    if (acceptedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only image format allowed"));
    }
  },
});

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
saucesRoute.post("/:id/like", SauceController.like);

export { saucesRoute };
