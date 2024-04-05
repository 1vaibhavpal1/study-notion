const nodemailer = require('nodemailer');
require("dotenv").config();

async function mailSender(email, title, body){
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
    
        let info = await transporter.sendMail({
            from: "StudyNotion || Vaibhav Pal",
            to: `${email}`,
            subject : `${title}`,
            html: `${body}`
        })
    }
    catch(err){
        console.log("Error in sending mail");
        console.log(err.message);
    }
}

module.exports = mailSender;