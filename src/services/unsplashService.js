const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

class UnsplashService {
    constructor() {
        this.accessKey = UNSPLASH_ACCESS_KEY;
    }

    // Search for images based on course topic
    async searchImages(query, count = 6) {
        try {
            const searchQuery = this.buildSearchQuery(query);
            const response = await fetch(
                `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=landscape&content_filter=high`,
                {
                    headers: {
                        'Authorization': `Client-ID ${this.accessKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Unsplash API error: ${response.status}`);
            }

            const data = await response.json();
            
            return data.results.map(image => ({
                id: image.id,
                url: image.urls.regular,
                smallUrl: image.urls.small,
                thumbUrl: image.urls.thumb,
                description: image.alt_description || image.description || 'Course thumbnail',
                photographer: image.user.name,
                photographerUrl: image.user.links.html,
                downloadUrl: image.links.download_location
            }));

        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
            return this.getFallbackImages();
        }
    }

    // Build search query for better results
    buildSearchQuery(topic) {
        // Clean the topic and add relevant keywords for better course thumbnails
        const cleanTopic = topic.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .trim();

        // Add educational keywords for better results
        const educationalKeywords = ['education', 'learning', 'study', 'course', 'technology'];
        const searchTerms = [cleanTopic, ...educationalKeywords];
        
        return searchTerms.join(' ');
    }

    // Get fallback images if Unsplash fails
    getFallbackImages() {
        return [
            {
                id: 'fallback-1',
                url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                smallUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
                thumbUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                description: 'Learning and Education',
                photographer: 'Green Chameleon',
                photographerUrl: 'https://unsplash.com/@craftedbygc',
                downloadUrl: null
            },
            {
                id: 'fallback-2',
                url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                smallUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
                thumbUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                description: 'Study and Learning',
                photographer: 'Green Chameleon',
                photographerUrl: 'https://unsplash.com/@craftedbygc',
                downloadUrl: null
            },
            {
                id: 'fallback-3',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                smallUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
                thumbUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                description: 'Technology and Learning',
                photographer: 'Florian Olivo',
                photographerUrl: 'https://unsplash.com/@florianolv',
                downloadUrl: null
            }
        ];
    }

    // Track download for Unsplash API requirements
    async trackDownload(downloadUrl) {
        if (!downloadUrl) return;
        
        try {
            await fetch(downloadUrl, {
                headers: {
                    'Authorization': `Client-ID ${this.accessKey}`
                }
            });
        } catch (error) {
            console.error('Error tracking download:', error);
        }
    }
}

export default new UnsplashService(); 