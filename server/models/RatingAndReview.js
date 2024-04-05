const mongoose = require('mongoose');

const ratingsAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        require : true,
    },
    review:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("RatingAndReview", ratingsAndReviewSchema);