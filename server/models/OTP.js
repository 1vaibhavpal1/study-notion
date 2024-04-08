const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate')
const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date
    }
})
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
async function sendVerificationMail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otpTemplate(otp) );
        console.log("Email sent succesfully: ", mailResponse);
    }
    catch(err){
        console.log("Error occured in sending mails: ", err);
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationMail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);
