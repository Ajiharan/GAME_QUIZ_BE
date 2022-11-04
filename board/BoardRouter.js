import express from "express";
import { validateToken } from "../lib/extra/helper.js";
import BoardSchema from "./BoardSchema.js";

const router = express.Router();

router.get("/getScores", validateToken, async (req, res) => {
  try {
    const scores = await BoardSchema.find().limit(5).sort("-highScore").exec();
    if (scores) {
      res.status(200).json(scores);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
