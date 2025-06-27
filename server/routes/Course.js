const express = require('express')
const router = express.Router();

//Controller for course
const{createCourse, getAllCourses, getCourseDetails, getFullCourseDetails, editCourse, getInstructorCourses, deleteCourse} = require('../controllers/Course');
//controller for categories
const{createCategories, categoryPageDetails, showAllCategories} = require('../controllers/Category');
//controller for Section
const{createSection, updateSection, deleteSection} = require('../controllers/Section')
//controller for Subsections
const{createSubSection, updateSubSection, deleteSubSection} = require('../controllers/SubSection')
//constollers for rating and review
const {createRating, getAverageRating, getAllRating} = require('../controllers/RatingAndReview')

const{updateCourseProgress} = require('../controllers/courseProgress')

//importing middlewares
const {auth, isInstructor, isStudent, isAdmin} = require('../middlewares/auth')

//                                                                  COURSE ROUTEs
//courses can be created only by instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//get All Registered courses
router.get("/getAllCourses", getAllCourses);
//get details for a specific course
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse) 

//                                                                 SECTION ROUTEs
//add a section to course
router.post("/addSection", auth, isInstructor, createSection)
//update a section
router.put("/updateSection", auth, isInstructor, updateSection);
//delete a section
router.delete("/deleteSection", auth, isInstructor, deleteSection);

//                                                                SubSection router
//create a sub section
router.post("/addSubSection", auth, isInstructor, createSubSection);
//update a sub sectin
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
//delete a sub section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);




//                                                                CATEGORY ROUTES
//                                                                (Only for admin)
router.post("/createCategory", auth, isAdmin, createCategories)
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);


//                                                                 Rating and Review
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;

