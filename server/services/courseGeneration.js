const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const axios = require('axios');

// Initialize Gemini
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
    temperature: 0.7,
});

class CourseGenerationService {
    constructor() {
        this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
    }

    // Helper method to clean and parse JSON
    cleanAndParseJSON(jsonString) {
        try {
            // First try to parse as-is
            return JSON.parse(jsonString);
        } catch (error) {
            try {
                // Clean common issues
                let cleaned = jsonString
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
                    .replace(/\n/g, '\\n') // Escape newlines
                    .replace(/\r/g, '\\r') // Escape carriage returns
                    .replace(/\t/g, '\\t') // Escape tabs
                    .replace(/\\/g, '\\\\') // Escape backslashes
                    .replace(/"/g, '\\"') // Escape quotes
                    .replace(/\\"/g, '"') // Fix over-escaped quotes
                    .replace(/\\\\/g, '\\'); // Fix over-escaped backslashes

                // Try to find and extract the JSON object
                const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                
                throw new Error('No valid JSON found in response');
            } catch (secondError) {
                console.error('JSON parsing failed:', secondError);
                console.error('Original string:', jsonString);
                throw new Error('Failed to parse AI response as JSON');
            }
        }
    }

    // Step 1: Generate course outline and chapters
    async generateCourseOutline(topic, difficulty = 'beginner') {
        const prompt = `
        Generate a comprehensive course outline for "${topic}" at ${difficulty} level.
        
        Return ONLY a valid JSON object in the following format (no markdown, no extra text):
        {
            "courseName": "Complete Course Title",
            "courseDescription": "Detailed course description",
            "whatWillYouLearn": "What students will learn from this course",
            "instructions": ["Instruction 1", "Instruction 2", "Instruction 3"],
            "tag": ["tag1", "tag2", "tag3"],
            "sections": [
                {
                    "sectionName": "Section Title",
                    "subSections": [
                        {
                            "title": "Subsection Title",
                            "description": "Brief description of what this subsection covers",
                            "timeDuration": "10-15 minutes"
                        }
                    ]
                }
            ]
        }
        
        Make sure the course is well-structured with 4-6 sections, each containing 3-5 subsections.
        Focus on practical, hands-on learning.
        IMPORTANT: Return only valid JSON, no code blocks or extra formatting.
        `;

        try {
            const result = await model.invoke(prompt);
            const response = result.content;
            
            // Extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return this.cleanAndParseJSON(jsonMatch[0]);
            }
            throw new Error('Invalid response format from AI');
        } catch (error) {
            console.error('Error generating course outline:', error);
            throw error;
        }
    }

    // Step 2: Generate detailed content for each subsection
    async generateSubSectionContent(subsectionTitle, description) {
        const prompt = `
        Generate detailed educational content for the subsection: "${subsectionTitle}"
        
        Description: ${description}
        
        Return ONLY a valid JSON object in the following format (no markdown, no extra text):
        {
            "title": "${subsectionTitle}",
            "description": "Detailed educational content that explains the concept thoroughly. Keep content concise and educational.",
            "timeDuration": "10-15 minutes",
            "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"],
            "keyPoints": ["Point 1", "Point 2", "Point 3"],
            "examples": ["Example 1", "Example 2"],
            "practiceExercises": ["Exercise 1", "Exercise 2"]
        }
        
        Make the content engaging, practical, and easy to understand.
        Include real-world examples and practical exercises.
        IMPORTANT: Return only valid JSON, no code blocks or extra formatting. Keep descriptions concise.
        `;

        try {
            const result = await model.invoke(prompt);
            const response = result.content;
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return this.cleanAndParseJSON(jsonMatch[0]);
            }
            throw new Error('Invalid response format from AI');
        } catch (error) {
            console.error('Error generating subsection content:', error);
            console.error('AI Response:', result?.content);
            throw error;
        }
    }

    // Step 3: Find relevant YouTube videos for each subsection
    async findYouTubeVideo(query) {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    key: this.youtubeApiKey,
                    maxResults: 1,
                    type: 'video',
                    videoDuration: 'medium', // 4-20 minutes
                    relevanceLanguage: 'en',
                    videoEmbeddable: true
                }
            });

            if (response.data.items && response.data.items.length > 0) {
                const video = response.data.items[0];
                return {
                    videoId: video.id.videoId,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.medium.url,
                    url: `https://www.youtube.com/watch?v=${video.id.videoId}`
                };
            }
            return null;
        } catch (error) {
            console.error('Error finding YouTube video:', error);
            return null;
        }
    }

    // Main method to generate complete course
    async generateCompleteCourse(topic, difficulty = 'beginner', instructorId) {
        try {
            console.log('Step 1: Generating course outline...');
            const courseOutline = await this.generateCourseOutline(topic, difficulty);
            
            console.log('Step 2: Generating detailed content for each subsection...');
            const sections = [];
            
            for (const sectionData of courseOutline.sections) {
                const subSections = [];
                
                for (const subSectionData of sectionData.subSections) {
                    console.log(`Generating content for: ${subSectionData.title}`);
                    
                    try {
                        // Generate detailed content
                        const detailedContent = await this.generateSubSectionContent(
                            subSectionData.title,
                            subSectionData.description
                        );
                        
                        // Find YouTube video
                        const videoQuery = `${topic} ${subSectionData.title} tutorial`;
                        const videoData = await this.findYouTubeVideo(videoQuery);
                        
                        const subSection = {
                            title: detailedContent.title,
                            description: detailedContent.description,
                            timeDuration: detailedContent.timeDuration,
                            videoUrl: videoData ? videoData.url : '',
                            learningObjectives: detailedContent.learningObjectives || [],
                            keyPoints: detailedContent.keyPoints || [],
                            examples: detailedContent.examples || [],
                            practiceExercises: detailedContent.practiceExercises || []
                        };
                        
                        subSections.push(subSection);
                        
                    } catch (subSectionError) {
                        console.error(`Error generating content for ${subSectionData.title}:`, subSectionError);
                        
                        // Create fallback subsection
                        const fallbackSubSection = {
                            title: subSectionData.title,
                            description: subSectionData.description,
                            timeDuration: subSectionData.timeDuration || "10-15 minutes",
                            videoUrl: '',
                            learningObjectives: [],
                            keyPoints: [],
                            examples: [],
                            practiceExercises: []
                        };
                        
                        subSections.push(fallbackSubSection);
                    }
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                sections.push({
                    sectionName: sectionData.sectionName,
                    subSections: subSections
                });
            }
            
            return {
                courseData: {
                    courseName: courseOutline.courseName,
                    courseDescription: courseOutline.courseDescription,
                    whatWillYouLearn: courseOutline.whatWillYouLearn,
                    instructions: courseOutline.instructions || [],
                    tag: courseOutline.tag || [],
                    instructor: instructorId,
                    status: 'Draft',
                    price: 0, // Default price, can be updated later
                    thumbnail: '', // Can be generated or uploaded later
                    category: null // Can be assigned later
                },
                sections: sections
            };
            
        } catch (error) {
            console.error('Error generating complete course:', error);
            throw error;
        }
    }

    // Generate course thumbnail using AI
    async generateCourseThumbnail(courseName) {
        const prompt = `
        Create a professional course thumbnail for: "${courseName}"
        
        The thumbnail should be:
        - Professional and educational
        - Include the course title
        - Use modern design elements
        - Be visually appealing
        - Suitable for an online learning platform
        
        Generate a detailed description of what this thumbnail should look like.
        `;

        try {
            const result = await model.invoke(prompt);
            return result.content;
        } catch (error) {
            console.error('Error generating thumbnail description:', error);
            return null;
        }
    }
}

module.exports = CourseGenerationService;