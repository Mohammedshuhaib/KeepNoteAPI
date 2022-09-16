const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const { generateAccessToken } = require("./Authorization");
const { createError } = require("../createError");
const nodemailer = require("../email/nodemailer");
const bcrypt = require("bcrypt");
const user = require("../models/auth");
dotenv.config();

module.exports = {
  Register: asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(createError(400, "Bad request"));

    let saltedPassword = await bcrypt.hash(password, 10);
    await nodemailer
      .sendOtp(email, name)
      .then(async (otp) => {
        res.cookie("otpCode", otp, { httpOnly: true, secure: true });
        res.cookie("name", name);
        res.cookie("email", email);
        res.cookie("password", saltedPassword, { httpOnly: true, secure: true });
        return res.sendStatus(200).json("success");
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(createError(409, "confilct"));
        } else {
          return next(createError(535, "Smtp error"));
        }
      });
  }),

  SubmitOtp: asyncHandler(async (req, res, next) => {
    let { otpCode, name, email, password } = req.cookies;
    let { otp } = req.body;
    if (otp === otpCode) {
      try {
        await user.create({ name, email, password });
        return res.sendStatus(200).json("otp verification success");
      } catch (err) {
        if (err.code === 11000) {
          return next(createError(409, "User already exist"));
        }
      }
    } else {
      return next(createError(401, "UnAutherized"));
    }
  }),

  Login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, "Bad request"));
    let User = await user.findOne({ email });
    if (User) {
      let response =await bcrypt.compare(password, User.password);
      console.log(response)
      if (response) {
        const users = { name: User.name };
        const accessToken = generateAccessToken(users); 
        const refreshToken = jwt.sign(users, process.env.REFRESH_TOKEN_SECRET);
        await user.updateOne({ _id: User._id }, { $set: { refreshToken } });
        res.cookie("accessToken", accessToken, {
          maxAge: 6000,
          httpOnly: true,
        });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.cookie("userId", User._id, { httpOnly: true });
        res.sendStatus(200).json(User.name)
      } else {
        return next(createError(401, "Incorrect password"));
      }
    } else {
      return next(createError(404, "User not exist please register"));
    }
  }),

  logout: asyncHandler(async(req,res,next) => {
    const {userId} = req.cookies
    try {
    let response = await user.updateOne({userId},{$unset:{refreshToken:""}})
    return res.sendStatus(200).json('ok')
    }catch(err) {
      return next(createError(500, 'something went wrong'))
    }
  })
};
