const User = require('../models/User')
const Profile = require('../models/Profile');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress')
const { imageUploader } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration")

require("dotenv").config();
//updating Profile
module.exports.updateProfile = async function updateProfile(req, res) {
    try {
        //get data
        console.log(req)
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // console.log("REQ=>",req);
        // console.log("Req.user=>",req.user);
        //get user id
        const userId = req.user.id;


        //validating
        if (!dateOfBirth || !about || !contactNumber || !gender) {
            return res.status(401).json({
                success: false,
                message: "Please fill all the fields properly"
            })
        }

        console.log("Validation ho gya");
        //getting user
        const user = await User.findById(userId);
        const profileId = user.additionalDetails;
        const profile = await Profile.findById(profileId);

        //update Profile
        const updatedProfile = await Profile.findByIdAndUpdate(profileId, {
            dateOfBirth: dateOfBirth,
            about: about,
            gender: gender,
            contactNumber: contactNumber
        },
            { new: true })
        //returning response
        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating Profile"
        })
    }
}

//deleting Profile
module.exports.deleteProfile = async function deleteProfile(req, res) {
    try {
        //getting id
        const id = req.user.id

        //getting user
        const user = await User.findById(id);
        //validating
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No such user exists"
            })
        }

        //delete Profile
        const ProfileId = user.additionalDetails;
        const deleteProfile = await Profile.findByIdAndDelete(ProfileId);

        //unenroll user from all enroled courses

        //fetching all courses he is enrolled in
        // const courses = user.courses;

        // //
        // courses.map(async (course) => {
        //     const courseDetails = await Course.findById(course);

        // })

        //deleting user
        await User.findByIdAndDelete(id);

        //returning response
        return res.json({
            success: true,
            message: "User Deleted Successfully",
            data: deleteProfile
        })


    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in deletin user"
        })
    }
}

//getting details of users
module.exports.getAllUserDetails = async function getAllUserDetails(req, res) {
    try {
        //get id
        console.log(req);
        const id = req.user.id;

        //validating and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //returning response
        return res.json({
            success: true,
            message: "User Details fetched successfully",
            data: userDetails,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error in getting user details ${err.message}`
        })
    }
}

//update display picture
module.exports.updateDisplayPicture = async function updateDisplayPicture(req, res) {
    try {
        //user id chahiye
        const userId = req.user.id;

        //fetch user
        const user = await User.findById(userId);

        //user validation
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No such user found",
            })
        }

        // console.log("REq is ===> ",req);
        //get image
        const img = req.files.displayPicture;
        // console.log("Image is ===>   ",img)

        //uploading in cloudinary
        const imageLink = await imageUploader(img, process.env.FOLDER_NAME);
        // console.log("IMAGE LINK ===>>>>       ",imageLink)
        //updating in database
        user.image = imageLink.secure_url;
        await user.save();

        // console.log("Printing USer from backend ===>  ",user);

        //return res
        return res.json({
            success: true,
            message: "Profile Photo updated successfully",
            data: user,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.getEnrolledCourses = async function getEnrolledCourses(req, res) {
    try {
        const userId = req.user.id
        
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()
        // console.log("Hello")
        userDetails = userDetails.toObject()
        // console.log("USERR DETAILS FROM BACKEND getEnrolledCoursesAPI ==>", userDetails)
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos?.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}
