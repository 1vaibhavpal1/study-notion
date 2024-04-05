const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        trim: true,
    },
    course:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            requird: true,
        }
    ]
})

module.exports = mongoose.model("Category",categorySchema);