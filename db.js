import mongoose from "mongoose";

export class Db {
  db;

  constructor() {
    this.db = this.connect();
  }

  /**
   * Connect to mongodb server with provided credentials
   *
   * @returns {Promise<typeof mongoose>} The mongodb connection
   */
  async connect() {
    try {
      return await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
      );
    } catch (e) {
      console.log(e);
    }
  }
}
