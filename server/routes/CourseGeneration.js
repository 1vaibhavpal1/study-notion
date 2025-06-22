const express = require('express');
const { auth } = require('../middlewares/auth');
const {
    generateCourseOutline,
    generateCompleteCourse,
    publishCourse,
    generateThumbnailDescription,
    getGenerationProgress
} = require('../controllers/CourseGeneration');

const router = express.Router();

// Route to generate course outline (Step 1)
router.post('/generate-outline', auth, generateCourseOutline);

// Route to generate complete course with all content
router.post('/generate-complete', auth, generateCompleteCourse);

// Route to publish course and add to user's courses
router.post('/publish-course', auth, publishCourse);

// Route to generate thumbnail description
router.post('/generate-thumbnail', auth, generateThumbnailDescription);

// Route to get generation progress
router.get('/progress/:generationId', auth, getGenerationProgress);

module.exports = router;