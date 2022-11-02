import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const validPassword = async (password, validData) => {
  return await bcrypt.compare(password, validData.password);
};

const generateToken = async (validData) => {
  const userToken = jwt.sign({ _id: validData._id }, process.env.TOKEN_KEY, {
    expiresIn: 60 * 60,
  });

  return userToken;
};

export const TokenValidator = (token) => {
  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    return data ? true : false;
  } catch (err) {
    return false;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {}
};

const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.header(process.env.TOKEN_KEY);
    req.token = jwtToken;
    const valid = await TokenValidator(jwtToken);
    console.log("valid", valid);
    if (valid) {
      next();
    } else {
      res.status(403).json("Sorry your Token is expired!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export { hashPassword, validPassword, generateToken, validateToken };
