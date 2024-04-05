const express = require('express')
const router = express.Router();
const {updateProfile, deleteProfile, getAllUserDetails, updateDisplayPicture, getEnrolledCourses, instructorDashboard} = require('../controllers/Profile')
const {auth, isInstructor, isStudent} = require('../middlewares/auth')
const{resetPasswordToken, resetPassword} = require('../controllers/ResetPassword')


router.put("/updateProfile", auth, updateProfile)
router.delete("/deleteProfile", auth, isStudent, deleteProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture",auth, updateDisplayPicture)
router.get("/getEnrolledCourses",auth,isStudent,getEnrolledCourses)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)


//reset password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;