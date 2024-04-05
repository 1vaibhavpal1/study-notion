const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')

//reset password tokenn
module.exports.resetPasswordToken = async function resetPasswordToken(req,res){
    //get email from req body
    const {email} = req.body

    // checking user for this emaail
    const user = await User.findOne({email: email});
    if(!user){
        return res.json({
            success: false,
            message: "Your email is not signed up"
        })
    }
    //generate token
    const token = crypto.randomUUID();

    //update USer by adding token and expiration time
    const updatedUser = await User.findOneAndUpdate({email:email},{
        token: token,
        resetPasswordExpires: Date.now() + 5*60*1000,
    },{new: true});

    // console.log("UpdatedUser =>" ,updatedUser);

    //createURL
    const url = `http://localhost:3000/update-password/${token}`
    //send mail containing url
    await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`)

    //returning response
    return res.json({
        success: true,
        message: "Email sent successfully",
        token: token
    })

}

//reset Password
module.exports.resetPassword = async function resetPassword(req,res){
    try{
        //data fetch 
    const {password, confirmPassword, token} = req.body;

    //validation
    if(password !== confirmPassword){
        return res.json({
            success : false,
            message: "Password not matching"
        })
    }

    //get details from db using token
    const userData = await User.findOne({token: token});

    if(!userData){
        return res.json({
            success: false,
            message: "Token is invalid",
        })
    }

    //token time check
    if(userData.resetPasswordExpires < Date.now()){
        return res.json({
            success: false,
            message: "Token is expired, please regerneate your token",
        })
    }

    //hash your pwd
    const hashedPass = await bcrypt.hash(password,10);

    //saving new pass in db
    const updatedUser = await User.findOneAndUpdate({token:token},{
        password: hashedPass,
    },{new: true});

    //return respnse
    return res.status(200).json({
        success: true,
        message: "Password updated successfuly",
        user: updatedUser,
    });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error in updating password"
        })
    }
}