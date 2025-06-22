const CourseGenerationService = require('../services/courseGeneration');
const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const User = require('../models/User');
const Category = require('../models/Category');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const courseGenerationService = new CourseGenerationService();

// Helper function to determine category based on topic and course content
const assignCategoryToCourse = async (topic, courseData) => {
    try {
        // Get all categories from database
        const categories = await Category.find({});
        console.log('Available categories:', categories.map(cat => ({ id: cat._id, name: cat.name })));

        if (categories.length === 0) {
            console.log('No categories found in database');
            return null;
        }

        const topicLower = topic.toLowerCase();
        const courseNameLower = courseData.courseName.toLowerCase();
        const courseDescLower = courseData.courseDescription.toLowerCase();
        const tagsLower = courseData.tag.join(' ').toLowerCase();
        
        // Combine all text for analysis
        const fullText = `${topicLower} ${courseNameLower} ${courseDescLower} ${tagsLower}`;
        
        console.log('Analyzing course content for category assignment...');
        console.log('Topic:', topic);
        console.log('Course Name:', courseData.courseName);
        
        // Category matching logic
        let selectedCategory = null;
        
        // Check for DevOps/Infrastructure keywords
        const devopsKeywords = ['devops', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'deployment', 'infrastructure', 'aws', 'azure', 'cloud', 'terraform', 'ansible', 'monitoring', 'logging'];
        if (devopsKeywords.some(keyword => fullText.includes(keyword))) {
            selectedCategory = categories.find(cat => cat.name.toLowerCase().includes('devops'));
        }
        
        // Check for Web Development keywords
        const webdevKeywords = ['web', 'javascript', 'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'frontend', 'backend', 'fullstack', 'api', 'rest', 'graphql', 'typescript', 'php', 'python', 'django', 'flask'];
        if (!selectedCategory && webdevKeywords.some(keyword => fullText.includes(keyword))) {
            selectedCategory = categories.find(cat => cat.name.toLowerCase().includes('webdev') || cat.name.toLowerCase().includes('web'));
        }
        
        // Check for Android/Mobile keywords
        const androidKeywords = ['android', 'mobile', 'app development', 'kotlin', 'java', 'flutter', 'react native', 'ios', 'swift', 'mobile app'];
        if (!selectedCategory && androidKeywords.some(keyword => fullText.includes(keyword))) {
            selectedCategory = categories.find(cat => cat.name.toLowerCase().includes('android') || cat.name.toLowerCase().includes('mobile'));
        }
        
        // If no specific match found, use "Others" category
        if (!selectedCategory) {
            selectedCategory = categories.find(cat => cat.name.toLowerCase().includes('others')) || categories[0];
        }
        
        console.log('Selected category:', selectedCategory.name, 'with ID:', selectedCategory._id);
        return selectedCategory._id;
        
    } catch (error) {
        console.error('Error assigning category:', error);
        return null;
    }
};

// Generate course outline (Step 1)
const generateCourseOutline = async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        const { userId } = req.user;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        console.log('Generating course outline for:', topic);
        const courseOutline = await courseGenerationService.generateCourseOutline(topic, difficulty || 'beginner');

        res.status(200).json({
            success: true,
            message: 'Course outline generated successfully',
            data: courseOutline
        });

    } catch (error) {
        console.error('Error in generateCourseOutline:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate course outline',
            error: error.message
        });
    }
};

// Generate complete course with all content
const generateCompleteCourse = async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        const userId = req.user.id;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        console.log('Starting complete course generation for:', topic);

        // Generate the complete course
        const generatedCourse = await courseGenerationService.generateCompleteCourse(
            topic,
            difficulty || 'beginner',
            userId
        );

        // Assign category to the course
        const assignedCategoryId = await assignCategoryToCourse(topic, generatedCourse.courseData);

        // Create the course in database (without thumbnail initially)
        const courseData = {
            ...generatedCourse.courseData,
            thumbnail: '', // Will be set when user selects thumbnail
            category: assignedCategoryId
        };

        console.log('Creating course with data:', {
            courseName: courseData.courseName,
            category: assignedCategoryId,
            instructor: userId
        });

        const course = await Course.create(courseData);

        // Create sections and subsections
        const createdSections = [];
        for (const sectionData of generatedCourse.sections) {
            const section = await Section.create({
                sectionName: sectionData.sectionName
            });

            const createdSubSections = [];
            for (const subSectionData of sectionData.subSections) {
                const subSection = await SubSection.create({
                    title: subSectionData.title,
                    description: subSectionData.description,
                    timeDuration: subSectionData.timeDuration,
                    videoUrl: subSectionData.videoUrl,
                    learningObjectives: subSectionData.learningObjectives,
                });
                createdSubSections.push(subSection._id);
            }

            section.subSection = createdSubSections;
            await section.save();
            createdSections.push(section._id);
        }

        // Update course with sections
        course.courseContent = createdSections;
        course.instructor = userId;
        await course.save();

        // Add course reference to user's courses array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if course is already in user's courses array
        if (!user.courses.includes(course._id)) {
            user.courses.push(course._id);
            await user.save();
        }

        // Update category's course array
        if (assignedCategoryId) {
            try {
                await Category.findByIdAndUpdate(
                    assignedCategoryId,
                    { $push: { course: course._id } },
                    { new: true }
                );
                console.log('Successfully added course to category:', assignedCategoryId);
            } catch (categoryUpdateError) {
                console.error('Error updating category with course:', categoryUpdateError);
            }
        }

        // Populate the course with all details
        const populatedCourse = await Course.findById(course._id)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .populate('instructor')
            .populate('category');

        console.log('Course generated successfully with category:', populatedCourse.category?.name);

        res.status(200).json({
            success: true,
            message: 'Course generated successfully',
            data: populatedCourse
        });

    } catch (error) {
        console.error('Error in generateCompleteCourse:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate complete course',
            error: error.message
        });
    }
};

// Publish course and add thumbnail
const publishCourse = async (req, res) => {
    try {
        const { courseId, thumbnail, price } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Find the course and update it
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Verify the user owns this course
        if (course.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to publish this course'
            });
        }

        // Update course with thumbnail and other details
        course.status = 'Published';
        course.price = price || 0;
        
        // Handle thumbnail - if it's a URL, use it directly
        if (thumbnail) {
            course.thumbnail = thumbnail;
        }

        await course.save();

        console.log('Course published successfully:', {
            courseId: course._id,
            courseName: course.courseName,
            thumbnail: course.thumbnail,
            price: course.price
        });

        // Populate the updated course
        const populatedCourse = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .populate('instructor')
            .populate('category');

        res.status(200).json({
            success: true,
            message: 'Course published successfully',
            data: populatedCourse
        });

    } catch (error) {
        console.error('Error in publishCourse:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish course',
            error: error.message
        });
    }
};

// Generate course thumbnail description
const generateThumbnailDescription = async (req, res) => {
    try {
        const { courseName } = req.body;

        if (!courseName) {
            return res.status(400).json({
                success: false,
                message: 'Course name is required'
            });
        }

        const thumbnailDescription = await courseGenerationService.generateCourseThumbnail(courseName);

        res.status(200).json({
            success: true,
            message: 'Thumbnail description generated successfully',
            data: { thumbnailDescription }
        });

    } catch (error) {
        console.error('Error in generateThumbnailDescription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate thumbnail description',
            error: error.message
        });
    }
};

// Get generation progress (for real-time updates)
const getGenerationProgress = async (req, res) => {
    try {
        const { generationId } = req.params;

        // This would typically be stored in Redis or a similar cache
        // For now, we'll return a mock response
        res.status(200).json({
            success: true,
            data: {
                progress: 75,
                currentStep: 'Generating subsection content',
                estimatedTimeRemaining: '2 minutes'
            }
        });

    } catch (error) {
        console.error('Error in getGenerationProgress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get generation progress',
            error: error.message
        });
    }
};

module.exports = {
    generateCourseOutline,
    generateCompleteCourse,
    publishCourse,
    generateThumbnailDescription,
    getGenerationProgress
};