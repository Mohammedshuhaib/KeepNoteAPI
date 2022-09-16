const mongoose = require('mongoose')

const Schema = mongoose.Schema

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    note: {type: String, required: true},
    color: {type: String, required: true},
    createdAt: {type: String},
    userId: {type:String}
  },
  { collection: 'noteData' }
)

const model = mongoose.model('noteData', noteSchema)

module.exports = model