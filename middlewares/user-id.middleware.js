/**
 * Check if userId in the bearer is the one owning the user model
 * Column in the researched model has to be named userId
 * @param {Mongoose.model} model
 */
export function userIdMiddleWare(model) {
  return async (req, res, next) => {
    const item = await model.findOne({ _id: req.params.id });
    if (item.userId === req.userId) {
      next();
    } else {
      return res.status(403).json({ message: "unauthorized request" });
    }
  };
}
