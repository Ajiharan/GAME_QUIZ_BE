import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import UserRouter from "./user/UserRouter.js";
import ScoreRouter from "./score/ScoreRouter.js";
import BoardRouter from "./board/BoardRouter.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(morgan("dev"));
app.use(cors());

app.use("/user", UserRouter);
app.use("/score", ScoreRouter);
app.use("/board", BoardRouter);

const PORT = 5000 || process.env.PORT;
mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_CONNECTION, (err) => {
  if (err) {
    throw err;
  }
  console.log("DB connected successfully");
});

app.listen(PORT, () => {
  console.log(`Port listen in ${PORT}`);
});
