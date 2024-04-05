const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course')
const mongoose = require('mongoose')

//creating review
module.exports.createRating = async function createRating(req, res) {
    try {
        //fetching user id
        const userId = req.user.id;

        //fetching data from req.body
        const { rating, review, courseId } = req.body;

        //check if user is enrolled in course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $eleMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(401).json({
                success: false,
                message: "Student not enrolled in course"
            });
        }
        //check if user already reviewd the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(401).json({
                success: false,
                message: "Course already reviewd"
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });
        //update course with this rating and review
        const course = await Course.findByIdAndUpdate({ _id: courseId }, {
            $push: {
                ratingsAndReview: ratingReview._id,
            }
        }, { new: true });

        //returning response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            RatingAndReview,
        })
    }
    catch (err) {

    }
}

//get Average Raing
module.exports.getAverageRating = async function getAverageRating(req, res) {
    try {
        //get course
        const courseId = req.body.courseId;

        //calculating average
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                },
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating and review exists
        return res.status(200).json({
            success: true,
            message: "Average rating is 0 no ratting given till now",
            averageRating: 0,
        })
    }
    catch (err) {
        return res.json({
            success: false,
            message: "Error in calculating average",
            error: err.message
        })
    }

}

//get all ratings and revies
module.exports.getAllRating = async function getAllRating(req,res){
    try{
        const allReviews = RatingAndReview.find({})
                                          .sort({rating: -1})
                                          .populate({
                                            path: "user",
                                            select: "firstName lastName email image",
                                          })
                                          .populate({
                                            path: "course",
                                            select: "courseName"
                                          })
                                          .exec();
        return res.json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success: false,
            message:"Error in fetching all ratings",
            err: err.message
        })
    }
} 