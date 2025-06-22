const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    timeDuration:{
        type: String,
    },
    description:{
        type: String,
    },
    videoUrl:{
        type: String,
    },
    learningObjectives: {
        type: [String],
        default: []
    },
    keyPoints: {
        type: [String],
        default: []
    },
    examples: {
        type: [String],
        default: []
    },
    practiceExercises: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("SubSection", subSectionSchema);