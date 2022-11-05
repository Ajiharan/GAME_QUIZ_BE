import express from "express";
import BoardSchema from "../board/BoardSchema.js";
import { validateToken } from "../lib/extra/helper.js";
import UserSchema from "../user/UserSchema.js";
import ScoreSchema from "./ScoreSchema.js";

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

router.get("/getScores/:id", validateToken, async (req, res) => {
  try {
    // console.log("param", req.params);
    const scores = await ScoreSchema.find({ uid: req.params.id })
      .limit(5)
      .sort("-score")
      .exec();
    if (scores) {
      res.status(200).json(scores);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
