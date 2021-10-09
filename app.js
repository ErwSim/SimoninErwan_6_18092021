import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { Db } from "./db";
import { authRoute, saucesRoute } from "./routes";
import { authMiddleWare } from "./middlewares";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

new Db();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/sauces", authMiddleWare, saucesRoute);

app.listen(port, () => {
  console.log(`Application started and listening at http://localhost:${port}`);
});

export default app;
