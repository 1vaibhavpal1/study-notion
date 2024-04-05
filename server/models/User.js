const mongoose= require("mongoose");

const userSchema  = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true
    },
    accountType:{
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    image:{
        type: String,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
    ],
    token:{
        type: String,

    },
    resetPasswordExpires:{
        type: Date,
    },
    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],
})

const User = mongoose.model("User",userSchema);
module.exports = User;