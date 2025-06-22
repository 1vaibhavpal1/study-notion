// API Configuration
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';

// API endpoints for course generation
export const COURSE_GENERATION_ENDPOINTS = {
    GENERATE_OUTLINE: `${BASE_URL}/course-generation/generate-outline`,
    GENERATE_COMPLETE: `${BASE_URL}/course-generation/generate-complete`,
    PUBLISH_COURSE: `${BASE_URL}/course-generation/publish-course`,
    GENERATE_THUMBNAIL: `${BASE_URL}/course-generation/generate-thumbnail`,
    GET_PROGRESS: (generationId) => `${BASE_URL}/course-generation/progress/${generationId}`,
};

// Helper function to create API headers
export const createApiHeaders = (token, contentType = 'application/json') => {
    const headers = {
        'Content-Type': contentType
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Helper function to make API calls
export const makeApiCall = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}; 