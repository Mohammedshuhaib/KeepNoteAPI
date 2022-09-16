const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    otp: {type: String, require: true},
    refreshToken: { type: String }
  },
  { collection: 'userData' }
)

const model = mongoose.model('userData', userSchema)

module.exports = model
