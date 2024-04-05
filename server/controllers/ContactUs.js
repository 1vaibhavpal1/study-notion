const{contactUsEmail} = require('../mail/templates/contactFormRes')
const mailSender = require('../utils/mailSender')

module.exports.contactUsController = async function contactUsController(req,res){
    //fetch data
    const {email, firstName, lastName, message, phoneNo, countryCode} = req.body

    try{
        const emailRes = await mailSender(email, "Your Data has been sent Successfully", contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode))

        console.log(emailRes);

        return res.json({
            success: true,
            message: "Email sent Successfully"
        })
    }
    catch(err){
        return res.json({
            success: false,
            message: "Something wrong in contactUs",
            error: err.message
        })
    }
}