const express = require('express')
const {capturePayment, verifyPayment, sendPaymentSuccessEmail, getRazorpayKey} = require('../controllers/Payment')
const {auth, isStudent} = require('../middlewares/auth')
const router = express.Router();

// Public route - Get Razorpay key for frontend
router.get("/key", getRazorpayKey);

//user must be logged in and a student to buy a course
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail",auth, isStudent, sendPaymentSuccessEmail)

module.exports = router