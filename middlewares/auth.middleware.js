import jwt from "jsonwebtoken";

/**
 * Middleware to check user authentication
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
export function authMiddleWare(req, res, next) {
  try {
    const authHeader = req.headers.authorization.split(" ");

    if (authHeader[0] === "Bearer") {
      const decodedToken = jwt.verify(authHeader[1], process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      if (req.body.userId && req.body.userId !== userId) {
        throw new Error("InvalidUserId");
      } else {
        req.userId = userId;
        next();
      }
    } else {
      throw new Error("InvalidAuthorizationHeader");
    }
  } catch (e) {
    res.status(401).json({ e });
  }
}
