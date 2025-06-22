import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner, FaCheck, FaYoutube, FaFileAlt, FaBrain, FaTimes, FaImage } from 'react-icons/fa';
import { COURSE_GENERATION_ENDPOINTS, createApiHeaders, makeApiCall } from '../../../../utils/apiConfig';
import UnsplashService from '../../../../services/unsplashService';

function GenerationProgress({ courseData, onComplete, onBack }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('Initializing course generation...');
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState(null);
    const [generatedCourse, setGeneratedCourse] = useState(null);
    const [thumbnails, setThumbnails] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);

    const generationSteps = [
        { id: 1, name: 'Analyzing topic and requirements', icon: FaFileAlt, progress: 20 },
        { id: 2, name: 'Creating detailed course content', icon: FaBrain, progress: 40 },
        { id: 3, name: 'Finding relevant YouTube videos', icon: FaYoutube, progress: 60 },
        { id: 4, name: 'Fetching course thumbnails', icon: FaImage, progress: 80 },
        { id: 5, name: 'Finalizing course structure', icon: FaCheck, progress: 100 }
    ];

    useEffect(() => {
        isMountedRef.current = true;
        generateCompleteCourse();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const safeSetState = (setter, value) => {
        if (isMountedRef.current) {
            setter(value);
        }
    };

    const updateProgress = (progressValue, stepMessage) => {
        safeSetState(setProgress, progressValue);
        safeSetState(setCurrentStep, stepMessage);
    };

    const generateCompleteCourse = async () => {
        try {
            // Reset state
            safeSetState(setError, null);
            safeSetState(setIsGenerating, true);
            safeSetState(setProgress, 0);

            // Create abort controller for this request
            abortControllerRef.current = new AbortController();

            // Step 1: Initialize
            updateProgress(10, 'Initializing course generation...');
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!isMountedRef.current) return;

            // Step 2: Start generation
            updateProgress(20, 'Analyzing topic and generating course outline...');

            console.log('Starting course generation with data:', courseData);

            const requestBody = {
                topic: courseData.topic,
                difficulty: courseData.difficulty || 'beginner'
            };

            console.log('Making API request with:', requestBody);

            // Step 3: Make API call
            updateProgress(30, 'AI is creating comprehensive course content...');

            const result = await makeApiCall(COURSE_GENERATION_ENDPOINTS.GENERATE_COMPLETE, {
                method: 'POST',
                headers: createApiHeaders(token),
                body: JSON.stringify(requestBody),
                signal: abortControllerRef.current.signal
            });

            if (!isMountedRef.current) return;

            console.log('Course generation successful:', result);

            // Step 4: Processing response
            updateProgress(60, 'Processing generated content...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (!isMountedRef.current) return;

            // Step 5: Fetch thumbnails
            updateProgress(80, 'Fetching course thumbnails from Unsplash...');
            
            try {
                const thumbnailImages = await UnsplashService.searchImages(courseData.topic, 6);
                safeSetState(setThumbnails, thumbnailImages);
                console.log('Thumbnails fetched successfully:', thumbnailImages.length);
            } catch (thumbnailError) {
                console.error('Error fetching thumbnails:', thumbnailError);
                // Continue even if thumbnails fail
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            if (!isMountedRef.current) return;

            // Step 6: Finalizing
            updateProgress(90, 'Finalizing course structure...');
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!isMountedRef.current) return;

            // Step 7: Complete
            updateProgress(100, 'Course generated successfully!');
            
            // Attach thumbnails to course data
            const courseWithThumbnails = {
                ...result.data,
                availableThumbnails: thumbnails,
                selectedThumbnail: thumbnails.length > 0 ? thumbnails[0] : null
            };
            
            safeSetState(setGeneratedCourse, courseWithThumbnails);
            safeSetState(setIsGenerating, false);

            // Wait a moment before calling onComplete
            setTimeout(() => {
                if (isMountedRef.current && onComplete) {
                    onComplete(courseWithThumbnails);
                }
            }, 1500);

        } catch (error) {
            console.error('Error generating course:', error);
            
            if (error.name === 'AbortError') {
                console.log('Course generation was cancelled');
                return;
            }

            let errorMessage = 'Failed to generate course. Please try again.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            safeSetState(setError, errorMessage);
            safeSetState(setIsGenerating, false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setProgress(0);
        setCurrentStep('Initializing course generation...');
        setIsGenerating(true);
        setThumbnails([]);
        generateCompleteCourse();
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        safeSetState(setIsGenerating, false);
        if (onBack) {
            onBack();
        }
    };

    // Error state
    if (error) {
        return (
            <div className="bg-richblack-800 p-8 rounded-lg border border-richblack-700">
                <div className="text-center">
                    <div className="text-pink-200 text-6xl mb-4">
                        <FaTimes />
                    </div>
                    <h3 className="text-xl font-semibold text-richblack-5 mb-2">
                        Generation Failed
                    </h3>
                    <p className="text-richblack-300 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onBack}
                            className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Progress Header */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                        {isGenerating ? (
                            <div className="animate-spin text-yellow-50">🤖</div>
                        ) : (
                            <div className="text-green-400">✅</div>
                        )}
                    </div>
                    <h2 className="text-2xl font-semibold text-richblack-5 mb-2">
                        {isGenerating ? 'Generating Your Course' : 'Course Generated Successfully!'}
                    </h2>
                    <p className="text-richblack-300">
                        {isGenerating 
                            ? `Creating comprehensive content for: "${courseData.topic}"` 
                            : 'Your course is ready for review and publishing!'
                        }
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-richblack-300 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-richblack-700 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-yellow-50 to-yellow-100 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Current Step */}
                <div className="text-center">
                    <p className="text-richblack-5 font-medium">{currentStep}</p>
                </div>
            </div>

            {/* Generation Steps */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    Generation Process
                </h3>
                <div className="space-y-4">
                    {generationSteps.map((step, index) => {
                        const isCompleted = progress >= step.progress;
                        const isCurrent = progress >= (index > 0 ? generationSteps[index - 1].progress : 0) && progress < step.progress;
                        
                        return (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                    isCompleted 
                                        ? 'bg-green-500 text-white' 
                                        : isCurrent 
                                            ? 'bg-yellow-50 text-richblack-900 animate-pulse'
                                            : 'bg-richblack-700 text-richblack-400'
                                }`}>
                                    {isCompleted ? (
                                        <FaCheck className="text-sm" />
                                    ) : isCurrent ? (
                                        <FaSpinner className="text-sm animate-spin" />
                                    ) : (
                                        <step.icon className="text-sm" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${
                                        isCompleted || isCurrent 
                                            ? 'text-richblack-5' 
                                            : 'text-richblack-400'
                                    }`}>
                                        {step.name}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Course Info */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    Course Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-richblack-400">Topic:</span>
                        <span className="text-richblack-5 ml-2">{courseData.topic}</span>
                    </div>
                    <div>
                        <span className="text-richblack-400">Difficulty:</span>
                        <span className="text-richblack-5 ml-2 capitalize">{courseData.difficulty || 'Beginner'}</span>
                    </div>
                    {courseData.duration && (
                        <div>
                            <span className="text-richblack-400">Duration:</span>
                            <span className="text-richblack-5 ml-2">{courseData.duration}</span>
                        </div>
                    )}
                    {thumbnails.length > 0 && (
                        <div>
                            <span className="text-richblack-400">Thumbnails:</span>
                            <span className="text-richblack-5 ml-2">{thumbnails.length} options found</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Preview */}
            {thumbnails.length > 0 && !isGenerating && (
                <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                    <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                        Generated Thumbnails Preview
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {thumbnails.slice(0, 6).map((thumbnail, index) => (
                            <div key={thumbnail.id} className="relative group">
                                <img
                                    src={thumbnail.thumbUrl}
                                    alt={thumbnail.description}
                                    className="w-full aspect-video object-cover rounded border border-richblack-600 group-hover:border-yellow-50 transition-colors"
                                />
                                {index === 0 && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-50 text-richblack-900 text-xs px-2 py-1 rounded-full">
                                        Default
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-richblack-400 text-sm mt-3">
                        The first thumbnail will be selected by default. You can change it in the next step.
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
                {isGenerating ? (
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors"
                    >
                        Cancel Generation
                    </button>
                ) : generatedCourse ? (
                    <button
                        onClick={() => onComplete && onComplete(generatedCourse)}
                        className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                        Continue to Course Preview
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default GenerationProgress;