# Course Generation Feature

This feature allows instructors to automatically generate complete courses using AI (Gemini) and Langchain. The system creates course structures, detailed content, and automatically finds relevant YouTube videos for each lesson.

## Features

- **AI-Powered Course Generation**: Uses Gemini AI to generate comprehensive course content
- **Sequential LLM Calls**: Multiple AI calls to create structured content
- **YouTube Integration**: Automatically finds relevant videos for each lesson
- **Real-time Progress Tracking**: Shows generation progress with visual feedback
- **Course Preview**: Review generated content before publishing
- **Editable Content**: Modify AI-generated content as needed

## Setup Instructions

### 1. Install Dependencies

The following packages have been installed in the server:

```bash
npm install @google/generative-ai langchain @langchain/google-genai axios
```

### 2. Environment Variables

Add these environment variables to your `.env` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. API Keys Setup

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables

#### YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add it to your environment variables

## How It Works

### 1. Course Generation Process

The system follows a sequential approach:

1. **Course Outline Generation**: AI creates a comprehensive course structure
2. **Content Generation**: Detailed educational content for each subsection
3. **Video Integration**: Finds relevant YouTube videos for each lesson
4. **Database Storage**: Saves the complete course to the database

### 2. API Endpoints

- `POST /api/v1/course-generation/generate-outline` - Generate course outline
- `POST /api/v1/course-generation/generate-complete` - Generate complete course
- `POST /api/v1/course-generation/generate-thumbnail` - Generate thumbnail description
- `GET /api/v1/course-generation/progress/:generationId` - Get generation progress

### 3. Frontend Components

- `GenerateCourse/index.jsx` - Main course generation page
- `CourseGenerationForm.jsx` - Form for course details input
- `GenerationProgress.jsx` - Real-time progress tracking
- `CoursePreview.jsx` - Preview and publish generated course

## Usage

### For Instructors

1. Navigate to Dashboard → Generate Course
2. Enter course topic and select difficulty level
3. Click "Generate Course Outline"
4. Review the generated outline
5. Click "Generate Complete Course"
6. Wait for AI to generate all content
7. Preview and publish the course

### Course Structure

The generated course follows the existing database schema:

- **Course**: Main course information
- **Sections**: Course chapters/modules
- **SubSections**: Individual lessons within sections

Each subsection includes:
- Title and description
- Time duration
- YouTube video URL
- Learning objectives
- Key points
- Examples
- Practice exercises

## Customization

### Modifying AI Prompts

Edit the prompts in `server/services/courseGeneration.js`:

- `generateCourseOutline()` - Course structure generation
- `generateSubSectionContent()` - Lesson content generation
- `generateCourseThumbnail()` - Thumbnail description

### Adding New Features

1. **Custom Content Types**: Add new fields to the generation prompts
2. **Additional APIs**: Integrate other content sources
3. **Progress Tracking**: Implement real-time progress with WebSockets
4. **Content Validation**: Add AI content quality checks

## Error Handling

The system includes comprehensive error handling:

- API key validation
- Rate limiting for YouTube API
- Fallback content generation
- User-friendly error messages
- Retry mechanisms

## Performance Considerations

- YouTube API has daily quotas (10,000 units)
- Gemini API has rate limits
- Consider implementing caching for repeated requests
- Add progress persistence for long-running generations

## Security

- All API calls require authentication
- API keys are stored securely in environment variables
- Input validation and sanitization
- Rate limiting to prevent abuse

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure environment variables are set correctly
2. **YouTube API Quota**: Check daily quota limits
3. **Generation Timeouts**: Increase timeout values for large courses
4. **Content Quality**: Review and edit AI-generated content

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Future Enhancements

- **Multi-language Support**: Generate courses in different languages
- **Advanced Content Types**: Include quizzes, assignments, and assessments
- **Content Templates**: Pre-defined course templates for different subjects
- **Collaborative Generation**: Multiple instructors working on the same course
- **AI Content Validation**: Automatic quality checks and improvements
- **Integration with LMS**: Export to other learning management systems