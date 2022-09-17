const mongoose = require('mongoose')

mongoose
  .connect('mongodb+srv://mohammedShuhaib:9ZfLn73vF2KlmTlS@cluster0.opqyxsa.mongodb.net/Notepad', { useNewUrlParser: true })
  .then(() => console.log('successfully connected to mongodb'))
  .catch((e) => {
    console.log('connection error', e.message)
  })

const db = mongoose.connection

module.exports = db