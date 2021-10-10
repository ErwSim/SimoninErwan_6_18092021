import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { Db } from "./db";
import { authRoute, saucesRoute } from "./routes";
import { authMiddleWare } from "./middlewares";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

new Db();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(path.resolve(), "images")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/sauces", authMiddleWare, saucesRoute);

app.listen(port, () => {
  console.log(`Application started and listening at http://localhost:${port}`);
});

export default app;
