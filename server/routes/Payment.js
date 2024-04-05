const express = require('express')
const {capturePayment, verifyPayment, sendPaymentSuccessEmail} = require('../controllers/Payment')
const {auth, isStudent} = require('../middlewares/auth')
const router = express.Router();

//user must be logged in and a student to buy a course
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail",auth, isStudent, sendPaymentSuccessEmail)

module.exports = router