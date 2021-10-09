import dotenv from "dotenv";
import express from "express";
import { Db } from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

new Db();

app.listen(port, () => {
  console.log(`Application started and listening at http://localhost:${port}`);
});

export default app;
