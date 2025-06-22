// Test script for course generation service
require('dotenv').config();
const CourseGenerationService = require('./services/courseGeneration');

async function testCourseGeneration() {
    console.log('Testing Course Generation Service...\n');
    
    const courseGenerationService = new CourseGenerationService();
    
    try {
        // Test 1: Generate course outline
        console.log('1. Testing course outline generation...');
        const outline = await courseGenerationService.generateCourseOutline('React.js Fundamentals', 'beginner');
        console.log('✅ Course outline generated successfully');
        console.log('Course Name:', outline.courseName);
        console.log('Sections:', outline.sections.length);
        console.log('Total Subsections:', outline.sections.reduce((total, section) => total + section.subSections.length, 0));
        console.log('');
        
        // Test 2: Generate subsection content
        console.log('2. Testing subsection content generation...');
        const subsectionContent = await courseGenerationService.generateSubSectionContent(
            'Introduction to React Components',
            'Learn the basics of React components and how to create them'
        );
        console.log('✅ Subsection content generated successfully');
        console.log('Title:', subsectionContent.title);
        console.log('Learning Objectives:', subsectionContent.learningObjectives.length);
        console.log('Key Points:', subsectionContent.keyPoints.length);
        console.log('');
        
        // Test 3: Find YouTube video
        console.log('3. Testing YouTube video search...');
        const videoData = await courseGenerationService.findYouTubeVideo('React.js components tutorial');
        if (videoData) {
            console.log('✅ YouTube video found successfully');
            console.log('Video Title:', videoData.title);
            console.log('Video URL:', videoData.url);
        } else {
            console.log('⚠️ No YouTube video found (this might be due to API key or quota issues)');
        }
        console.log('');
        
        console.log('🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Make sure you have set up the following environment variables:');
        console.error('- GEMINI_API_KEY');
        console.error('- YOUTUBE_API_KEY');
    }
}

// Run the test
testCourseGeneration();