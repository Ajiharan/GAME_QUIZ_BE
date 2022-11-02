import express from "express";
import { decodeToken, validateToken } from "../lib/extra/helper.js";
import UserSchema from "./UserSchema.js";

import {
  generateToken,
  hashPassword,
  validPassword,
} from "../lib/extra/helper.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userData = await UserSchema.findOne({ userName: req.body.userName });
    if (userData) {
      return res.status(400).json("UserName already exists");
    }
    const hashPwd = await hashPassword(req.body.password);
    console.log(hashPwd);
    const postData = await new UserSchema({
      userName: req.body.userName,
      password: hashPwd,
    });
    const postUser = await postData.save();
    if (postUser) {
      return res.status(200).json("Registered successfully");
    }
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const validData = await UserSchema.findOne({ userName: req.body.userName });
    if (!validData) {
      return res.status(400).json("Invalid userName");
    }

    const validPass = await validPassword(req.body.password, validData);

    if (validPass) {
      const userToken = await generateToken(validData);

      res.header(process.env.TOKEN_KEY, userToken).json(userToken);
    } else {
      return res.status(400).json("Invalid password");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/detail", validateToken, async (req, res) => {
  try {
    const uid = decodeToken(req.headers.quiz)?._id;
    const user = await UserSchema.findOne({ _id: uid })
      .select("-password")
      .exec();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
