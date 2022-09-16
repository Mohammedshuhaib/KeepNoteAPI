const mongoose = require('mongoose')

mongoose
  .connect('mongodb://127.0.0.1:27017/Notpad', { useNewUrlParser: true })
  .then(() => console.log('successfully connected to mongodb'))
  .catch((e) => {
    console.log('connection error', e.message)
  })

const db = mongoose.connection

module.exports = db