
const express = require('express')
let router = express.Router();
const noteController = require('../controller/notes')
const Authorization = require('../controller/Authorization')

router.post('/create', noteController.createNotes)
router.get('/getNotes', noteController.getData)
router.delete('/deleteNote', noteController.deleteData)
router.put('/updateNote',noteController.updateNote)

module.exports = router