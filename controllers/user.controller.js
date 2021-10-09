import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export class UserController {
  /**
   * Create a new user
   * @param {Request} req
   * @param {Response} res
   * @returns success message
   */
  static async create(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        email: email,
        password: hashedPassword,
      });

      await user.save();

      return res.status(201).json({ message: "userCreated" });
    } catch (e) {
      console.error(e);

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ e });
      }

      return res.status(500).json({ e });
    }
  }

  /**
   * Login an user
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "userNotFound" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "invalidPassword" });
      }

      res.status(200).json({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        }),
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ e });
    }
  }
}
