const express = require('express')
const router = express.Router();

const{login, signUp, changePassword, sendOTP} = require('../controllers/Auth')
const {auth} = require('../middlewares/auth')

//login signup functions
router.post("/login", login);
router.post("/signup",signUp);
router.post('/sendOTP',sendOTP);
router.post('/changepassword',auth, changePassword)



module.exports = router;
