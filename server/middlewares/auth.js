const jwt = require('jsonwebtoken')
require("dotenv").config()
//auth
module.exports.auth = async function auth(req,res,next){
    try{
        //extract token
        // console.log("REQ IN AUTH MIDDLEWARE ==>>", req)
        // console.log(req.header("Authorization"))
        // console.log("FGASFDASGSG === " ,req.cookies)
        // console.log(req.body)

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(500).json({
                success: false,
                message: "Token is missing"
            });
        }
        // console.log("TOKEN IS ===>> ",token)
        //verify
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("Setting req.user ==>>", decode);
            req.user = decode;
            
        }
        catch(err){
            console.log(err);
            return res.status(401).json({
                success: false,
                message : "Something went wrong while validating the token",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
//isStudent
module.exports.isStudent = async function isStudent(req, res, next){
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a private route for student"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, please try again"
        })
    }
}

//isIntructor
module.exports.isInstructor = async function isInstructor(req, res, next){
    try{

        // console.log("REQ  is ==>>> ", req)
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a private route for instructor"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"Instructor role cannot be verified, please try again"
        })
    }
}

//isAdmin
module.exports.isAdmin = async function isAdmin(req, res, next){
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a private route for admin"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"Admin role cannot be verified, please try again"
        })
    }
}
