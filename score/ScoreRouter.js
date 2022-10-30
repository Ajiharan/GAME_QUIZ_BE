import ScoreSchema from "./ScoreSchema.js";
import BoardSchema from "../board/BoardSchema.js";
import UserSchema from "../user/UserSchema.js";
import express from "express";
import { validateToken } from "../lib/extra/helper.js";

const router = express.Router();

router.post("/addScore", validateToken, async (req, res) => {
  try {
    const user = await UserSchema.findOne({ _id: req.body.uid });

    if (!user) {
      return res.status(400).json("Invalid User");
    }
    const postScore = new ScoreSchema({
      uid: req.body.uid,
      score: req.body.score,
      userName: user.userName,
    });
    const saveScore = await postScore.save();
    const isUserExists = await BoardSchema.findOne({ uid: req.body.uid });

    let currentUserHighScore;
    if (isUserExists) {
      if (isUserExists.highScore < req.body.score) {
        currentUserHighScore = await BoardSchema.findOneAndUpdate(
          { uid: req.body.uid },
          { highScore: req.body.score },
          { new: true }
        );
        console.log("currentUserHighScore", currentUserHighScore);
      }
    } else {
      const postHighScore = new BoardSchema({
        uid: req.body.uid,
        highScore: req.body.score,
        userName: user.userName,
      });
      currentUserHighScore = await postHighScore.save();
    }

    if (saveScore) {
      res.status(200).json({
        _id: saveScore._id,
        userName: saveScore.userName,
        score: saveScore.score,
        highScore: currentUserHighScore?.highScore || isUserExists.highScore,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getScores", validateToken, async (req, res) => {
  try {
    const scores = await ScoreSchema.find().limit(10);
    if (scores) {
      res.status(200).json(scores);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
