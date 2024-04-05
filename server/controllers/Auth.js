const OTP = require('../models/OTP')
const User = require('../models/User')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Profile = require('../models/Profile')
const mailSender = require('../utils/mailSender')
const { passwordUpdated } = require("../mail/templates/passwordUpdate")

require("dotenv").config()
//sendOtp
module.exports.sendOTP = async function sendOTP(req,res) {
    try{
        //fetch email
        const {email} = req.body;
        
        //fetch user
        const user = await User.findOne({email});
        
        //validate
        if(user){
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            })
        }
        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp : otp})
        }
        //creating payload
        const payload = {email, otp};

        //create an entry in db
        const otpBody = await OTP.create(payload);
        // console.log(otpBody);

        //return response successfully
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        });
    }
    catch(err){
        return res.status(500).json({
            message: err.message,
        })
    }
}

//sign up 
module.exports.signUp = async function signUp(req,res){
    try{
        //fetch details
    const{
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp
    } = req.body;

    console.log(otp);
    //validateing
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.json({
            success: false,
            message: "All fields must be filled"
        })
    }
    //matching passwords
    if(password !== confirmPassword){
        return res.json({
            success: false,
            message: "Confirm Password should match Password"
        })
    }
    
    //checking user
    const user = await User.findOne({email})

    if(user){
        return res.status(400).json({
            message: "User with same email id already exists",
        })
    }

    //find most recent otp
    const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);

    // console.log("sdf");
    console.log("Recent Otp ==>",recentOtp[0].otp);

    //validate otp
    if(otp !== recentOtp[0].otp){
        return res.json({
            success: false,
            message:"Wrong OTP"
        })
    }
    

    //hashing password
    const hashedPass = await bcrypt.hash(password, 10);
    // console.log(hashedPass);


    //profile
    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
    });
    // console.log(profileDetails);
    //create entry in db 
    const userEntry = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPass,
        accountType,
        additionalDetails : profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`
    })
    // console.log(userEntry)
    return res.json({
        success: true,
        messaage:"User registered successfully",
        user: userEntry,
    });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.messaage
        })
    }
}

//login
module.exports.login = async function login(req,res){
    try{
        //req se data fetch krenge
    const {email, password} = req.body;

    //validating input
    if(!email || !password){
        return res.json({
            messaage: "Enter all fields"
        })
    }

    //user fetch krke laenge
    const user = await User.findOne({email : email}).populate("additionalDetails")

    //vlidating user
    if(!user){
        return res.status(404).json({
            message:"No such user found, Please Signup and continue",
        })
    }

    //checking password
    if(!(await bcrypt.compare(password,user.password))){
        return res.status(401).json({
            message:"The Password entered is wrong"
        })
    }

    // console.log("===>>",await bcrypt.compare(user.password,password))
    //creating a token for loggedin
    const payload={
        email: user.email,
        id: user._id,
        accountType : user.accountType,
    }
    let token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn : "2h"
    })

    user.token = token;
    user.password = undefined;

    
    //passing a token
    res.cookie("token",token,{httpOnly: true, expires: new Date(Date.now() + 3*24*60*60*1000)})
    .status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully"
    })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
            error: err.messaage,
        })
    }
}

//change Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
    //   console.log("USER DETAILS ==>....", userDetails)
    //   console.log(userDetails.password)
  
      // Get old password, new password, and confirm new password from req.body
      const { currPassword, newPassword } = req.body
  
      console.log("ISSE AAGE JAEGAA")
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        currPassword,
        userDetails.password
      )
      console.log("SHI ME AAGYAAA")
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        
        console.log("Email sent successfully:")
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }
