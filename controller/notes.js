const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const { generateAccessToken } = require("./Authorization");
const { createError } = require("../createError");
const nodemailer = require("../email/nodemailer");
const bcrypt = require("bcrypt");
const Note = require("../models/note");
const moment = require('moment')
dotenv.config();

module.exports = {
  createNotes: asyncHandler(async (req, res, next) => {
    const { accessToken, userId } = req.cookies;
    if (!accessToken) return next(createError(403, "no accessToken found"));
    let response = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (response) {
      try {
        const data = req.body
        data.color = data.color.hex
        
       let createdAt = moment().format("MMM Do YY");
       console.log(createdAt)
        await Note.create({ ...data,createdAt,userId});
        return res.sendStatus(200).json('ok');
      } catch (err) {
        return next(createError(500,'something went wrong'))
      }
    } else {
      return next(createError(401, "Your are not autherized"));
    }
  }),

  getData: asyncHandler(async( req,res,next) => {
    let data = await Note.find({userId: req.cookies.userId})
    return res.status(200).json(data)
  }),

  deleteData: asyncHandler(async( req, res, next) => {
   const {noteId } = req.body
   await Note.deleteOne({noteId})
  }),

  updateNote: asyncHandler(async( req, res, next) => {
    const {_id, title, note, color} = req.body
    await Note.updateOne({_id:_id},{$set:{title,note,color}})
   return res.status(200).json('ok')
  })
};
