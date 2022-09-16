
const express = require('express')
let router = express.Router();
const authController = require('../controller/auth')
const Authorization = require('../controller/Authorization')

router.post('/register', authController.Register)
router.post('/submitOtp', authController.SubmitOtp)
router.post('/login', authController.Login)
router.post('/logout', authController.logout)
router.post('/token', Authorization.token)
module.exports = router