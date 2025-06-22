const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type:String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    courseDescription:{
        type:String,
        trim: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    whatWillYouLearn:{
        type: String,
    },
    instructions:{
        type: [String],
    },
    courseContent:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        }
    ],
    ratingsAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref :"RatingAndReview",
        }
    ],
    thumbnail:{
        type: String,
    },
    tag:{
        type: [String],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
       }
    ],
    status: {
        type: String,
        required: true,
        default: "Draft"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("Course", courseSchema);