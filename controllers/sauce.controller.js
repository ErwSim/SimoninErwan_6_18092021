import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { SauceModel } from "../models";

export class SauceController {
  /**
   * Get all sauces
   * @param {Request} req
   * @param {Response} res
   * @returns A http response with all sauces
   */
  static async getAll(req, res) {
    try {
      const sauces = await SauceModel.find();
      return res.status(200).json(sauces);
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  }

  /**
   * Get one sauce based on id
   * @param {Request} req
   * @param {Response} res
   * @returns A http reponse with the specific sauce
   */
  static async getOne(req, res) {
    try {
      const id = req.params.id;
      const sauce = await SauceModel.findOne({ _id: id });
      return res.status(200).json(sauce);
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  }

  /**
   * Create a new sauce
   * @param {Request} req
   * @param {Response} res
   * @returns success message
   */
  static async create(req, res) {
    const { name, manufacturer, description, mainPepper, heat, userId } =
      JSON.parse(req.body.sauce);
    const imageUrl = `http://localhost:3000/${req.file.path}`;

    try {
      const sauce = new SauceModel({
        name,
        manufacturer,
        description,
        mainPepper,
        heat,
        imageUrl,
        userId,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
      });

      await sauce.save();

      return res.status(201).json({ message: "sauceCreated" });
    } catch (e) {
      console.error(e);

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).json(e);
      }

      return res.status(500).json(e);
    }
  }

  /**
   * Update an existing sauce
   * @param {Request} req
   * @param {Response} res
   * @returns success message
   */
  static async update(req, res) {
    try {
      const id = req.params.id;
      const { name, manufacturer, description, mainPepper, heat, userId } =
        req.file ? JSON.parse(req.body.sauce) : req.body;

      const bodyUpdate = {
        name,
        manufacturer,
        description,
        mainPepper,
        heat,
      };

      if (req.file) {
        bodyUpdate.imageUrl = `http://localhost:3000/${req.file.path}`;
      }

      await SauceModel.updateOne({ _id: id }, bodyUpdate);

      res.status(200).json({ message: "sauceUpdated" });
    } catch (e) {
      console.error(e);

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).json(e);
      }

      return res.status(500).json(e);
    }
  }

  /**
   * Delete an existing sauce and its image
   * @param {Request} req
   * @param {Response} res
   * @returns success message
   */
  static async delete(req, res) {
    try {
      const id = req.params.id;
      const sauce = await SauceModel.findOne({ _id: id });

      // Delete the image
      const imgToDelete = sauce.imageUrl.replace("http://localhost:3000", "");
      fs.unlinkSync(path.join(path.resolve(), imgToDelete));

      // Delete the entry in the database
      await SauceModel.deleteOne({ _id: id });

      return res.status(200).json({ message: "sauceDeleted" });
    } catch (e) {
      console.error(e);

      return res.status(500).json(e);
    }
  }

  static async like(req, res) {
    try {
      const id = req.params.id;
      const sauce = await SauceModel.findOne({ _id: id });

      if (req.userId !== req.body.userId) {
        return res.status(403).json({ message: "unauthorized request" });
      }

      const newSauce = Object.assign({
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      });

      const { usersLiked, usersDisliked } = sauce;
      const didUserLiked = usersLiked.findIndex(
        (userId) => userId === req.body.userId
      );
      const didUserDisliked = usersDisliked.findIndex(
        (userId) => userId === req.body.userId
      );

      switch (req.body.like) {
        case 0:
          if (didUserLiked !== -1) {
            newSauce.usersLiked.splice(didUserLiked, 1);
            newSauce.likes--;
          }

          if (didUserDisliked !== -1) {
            newSauce.usersDisliked.splice(didUserDisliked, 1);
            newSauce.dislikes--;
          }
          break;

        case 1:
          if (didUserLiked === -1) {
            newSauce.usersLiked.push(req.body.userId);
            newSauce.likes++;
          }
          break;

        case -1:
          if (didUserDisliked === -1) {
            newSauce.usersDisliked.push(req.body.userId);
            newSauce.dislikes++;
          }
          break;
      }

      await SauceModel.updateOne({ _id: id }, newSauce);

      return res
        .status(200)
        .json({ message: req.body.like ? "sauceLiked" : "sauceDisliked" });
    } catch (e) {
      console.error(e);

      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).json(e);
      }

      return res.status(500).json(e);
    }
  }
}
