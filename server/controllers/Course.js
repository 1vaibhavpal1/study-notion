const Category = require('../models/Category');
const User = require('../models/User')
const SubSection = require('../models/SubSection')
const Course = require('../models/Course')
const CourseProgress = require("../models/CourseProgress")
const Section = require('../models/Section')
const {imageUploader} = require('../utils/imageUploader')
const { convertSecondsToDuration } = require("../utils/secToDuration")

const mongoose = require('mongoose')
require("dotenv").config()
//create course
module.exports.createCourse = async function createCourse(req,res){
    try{
        //fetch data
        const {courseName, courseDescription, whatWillYouLearn, price, category, tag, instructions} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // console.log("REQ IS ==>> ", req)
        // console.log("!courseName =>", !courseName)
        // console.log("!courseDescription =>", !courseDescription)
        // console.log("!whatYouWilLearn =>", whatWillYouLearn)
        // console.log("!tag =>", !tag)
        // console.log("!category =>", !category)
        // console.log("!price =>", !price)



        //validation
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !category || !tag || !instructions){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        //check for intructor
        const userId = req.user.id;
        console.log("User id =>", userId);
    
        const instructorDetails = User.findById(userId);

        // console.log("Intructor Details",instructorDetails);


        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found"
            })
        }
        // console.log("Instructor Details", instructorDetails);

        //check given tag vald or not
        const categoryDetails = await Category.findById(category);
        console.log("category=>",category);
        if(!categoryDetails){
            return res.status(403).json({
                success:false,
                message: "Category Details not found"
            })
        }

        //upload imafge to cloudinary
        const thumbnailImage = await imageUploader(thumbnail,process.env.FOLDER_NAME);

        
        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: userId,
            whatWillYouLearn: whatWillYouLearn,
            price,
            tag,
            category: categoryDetails,
            thumbnail: thumbnailImage.secure_url,
            instructions,
        })
        // console.log("ID" , newCourse._id);
        // console.log(instructorDetails)
        // console.log("YAHAHOOOOOOOOO",instructorDetails._conditions._id);
        // console.log("instructor Details id", instructorDetails._id);
        //add the course to schema of insturcto
        const updatedUser = await User.findByIdAndUpdate(
            {
                _id: instructorDetails._conditions._id
            },
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        //update the cateogry schema

        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {
                $push:{
                    course: newCourse._id,
                }
            },
            {new: true},
        );

        return res.status(200).json({
            success:true,
            message:"Created Course successfuly",
            data: newCourse
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Error in creating course ${err.message}`
        })
    }
}

//fetch all courses
module.exports.getAllCourses = async function getAllCourses(req,res){
    try{
        const courses = await Course.find({}, {courseName:true,
            price: true,
            thumbnail:true,
            instructor: true,
            ratingsAndReview: true,
            studentsEnrolled:true})
            .populate("instructor")
            .exec()

        return res.status(200).json({
            success:true,
            message: "Data for all course has been fetched",
            courses
        })
    }
    catch(err){
        return res.status(500).json({
            success:true,
            message:`error in fetching all courese :${err.message}`
        })
    }
} 

//get details of the enitre course
module.exports.getCourseDetails = async function getCourseDetails(req,res){
    try{
        //fetching id of course
        const {courseId} = req.body;
        //fetching the course and popupalting
        const course = await Course.findById(courseId)
                                .populate({
                                    path:"instructor",
                                    populate: {
                                        path: "additionalDetails"
                                        
                                    }
                                })
                                .populate({
                                    path: "courseContent",
                                    populate:{
                                        path:"subSection"
                                    }
                                })
                                .populate("ratingsAndReview")
                                .populate("category")
                                
        //validation
        if(!course){
            return res.json({
                success: false,
                message: "No Such Course Exists"
            })
        }
        //return response
        return res.json({
            success:true,
            data: course,
            message: "Data fetched successfully"
       })
    }
    catch(err){
        return res.json({
            success: false,
            message: "Error in fetching course details"
        })
    }
};

//edit any details of the course
exports.editCourse = async (req, res) => {
    try {
     
      const { courseId } = req.body
      const updates = req.body
      console.log(updates)
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await imageUploader(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          console.log(key)
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
           
          } else {
            course[key] = updates[key]
          }
        }
      }
  console.log(course)
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
};

//get full details of course
exports.getFullCourseDetails = async (req, res) => {
    try {

      // console.log("REQ is ===>>>", req)
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        // .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
}