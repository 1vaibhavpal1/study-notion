import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FaLightbulb, FaGraduationCap, FaClock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { COURSE_GENERATION_ENDPOINTS, createApiHeaders, makeApiCall } from '../../../../utils/apiConfig';

function CourseGenerationForm({ onNext }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            difficulty: 'beginner'
        }
    });
    const { token } = useSelector((state) => state.auth);

    const watchedTopic = watch('topic');
    const watchedDifficulty = watch('difficulty');

    const difficultyLevels = [
        { value: 'beginner', label: 'Beginner', description: 'No prior knowledge required' },
        { value: 'intermediate', label: 'Intermediate', description: 'Some basic knowledge helpful' },
        { value: 'advanced', label: 'Advanced', description: 'Requires solid foundation' }
    ];

    const onSubmit = async (data) => {
        if (!data.topic.trim()) {
            toast.error('Please enter a valid topic');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Generating course outline...');

        try {
            console.log('Submitting course generation form with data:', data);

            const result = await makeApiCall(COURSE_GENERATION_ENDPOINTS.GENERATE_OUTLINE, {
                method: 'POST',
                headers: createApiHeaders(token),
                body: JSON.stringify({
                    topic: data.topic.trim(),
                    difficulty: data.difficulty
                })
            });
            
            toast.success('Course outline generated successfully!', { id: toastId });
            
            // Pass the form data along with the outline
            const courseData = {
                topic: data.topic.trim(),
                difficulty: data.difficulty,
                duration: data.duration,
                notes: data.notes,
                outline: result.data
            };

            console.log('Passing course data to next step:', courseData);
            onNext(courseData);

        } catch (error) {
            console.error('Error generating course outline:', error);
            
            let errorMessage = 'Failed to generate course outline. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-richblack-5 mb-2">
                        AI Course Generation
                    </h2>
                    <p className="text-richblack-300">
                        Provide the details below and our AI will generate a complete course with sections, content, and relevant YouTube videos.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Topic Input */}
                    <div>
                        <label className="flex items-center gap-2 text-richblack-5 text-sm font-medium mb-2">
                            <FaLightbulb className="text-yellow-50" />
                            What topic would you like to teach? *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., React.js Fundamentals, Python for Data Science, Digital Marketing Basics"
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50"
                            {...register('topic', { 
                                required: 'Topic is required',
                                minLength: {
                                    value: 5,
                                    message: 'Topic should be at least 5 characters long'
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'Topic should not exceed 100 characters'
                                },
                                validate: {
                                    notEmpty: value => value.trim().length > 0 || 'Topic cannot be empty or just spaces'
                                }
                            })}
                        />
                        {errors.topic && (
                            <p className="text-pink-200 text-sm mt-1">{errors.topic.message}</p>
                        )}
                        {watchedTopic && watchedTopic.length > 0 && (
                            <p className="text-richblack-400 text-sm mt-1">
                                {watchedTopic.length}/100 characters
                            </p>
                        )}
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label className="flex items-center gap-2 text-richblack-5 text-sm font-medium mb-3">
                            <FaGraduationCap className="text-yellow-50" />
                            Difficulty Level *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {difficultyLevels.map((level) => (
                                <label
                                    key={level.value}
                                    className="relative cursor-pointer group"
                                >
                                    <input
                                        type="radio"
                                        value={level.value}
                                        className="sr-only"
                                        {...register('difficulty', { required: 'Please select a difficulty level' })}
                                    />
                                    <div className={`p-4 border-2 rounded-lg hover:border-yellow-50 transition-all duration-200 ${
                                        watchedDifficulty === level.value 
                                            ? 'border-yellow-50 bg-yellow-50/10' 
                                            : 'border-richblack-600'
                                    }`}>
                                        <div className="text-richblack-5 font-medium mb-1">
                                            {level.label}
                                        </div>
                                        <div className="text-richblack-400 text-sm">
                                            {level.description}
                                        </div>
                                    </div>
                                    <div className={`absolute top-3 right-3 w-4 h-4 border-2 rounded-full transition-all ${
                                        watchedDifficulty === level.value 
                                            ? 'border-yellow-50 bg-yellow-50' 
                                            : 'border-richblack-600'
                                    }`}>
                                        {watchedDifficulty === level.value && (
                                            <div className="w-2 h-2 bg-richblack-900 rounded-full mx-auto mt-0.5"></div>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.difficulty && (
                            <p className="text-pink-200 text-sm mt-2">{errors.difficulty.message}</p>
                        )}
                    </div>

                    {/* Estimated Duration */}
                    <div>
                        <label className="flex items-center gap-2 text-richblack-5 text-sm font-medium mb-2">
                            <FaClock className="text-yellow-50" />
                            Estimated Course Duration (Optional)
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50"
                            {...register('duration')}
                        >
                            <option value="">Select duration (optional)</option>
                            <option value="2-4 hours">2-4 hours</option>
                            <option value="4-8 hours">4-8 hours</option>
                            <option value="8-12 hours">8-12 hours</option>
                            <option value="12+ hours">12+ hours</option>
                        </select>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="text-richblack-5 text-sm font-medium mb-2 block">
                            Additional Instructions (Optional)
                        </label>
                        <textarea
                            placeholder="Any specific requirements, target audience, or special instructions for the AI..."
                            rows="4"
                            maxLength="500"
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 resize-none"
                            {...register('notes', {
                                maxLength: {
                                    value: 500,
                                    message: 'Notes should not exceed 500 characters'
                                }
                            })}
                        />
                        {errors.notes && (
                            <p className="text-pink-200 text-sm mt-1">{errors.notes.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-yellow-50 text-richblack-900 font-medium rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FaLightbulb />
                                    Generate Course
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Card */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    What will be generated?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 text-sm text-richblack-300">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Complete course structure with sections and subsections</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Detailed educational content for each lesson</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Learning objectives and practice exercises</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-richblack-300">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Relevant YouTube videos automatically added</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Course description and appropriate tags</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-50 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Ready-to-publish course structure</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseGenerationForm;