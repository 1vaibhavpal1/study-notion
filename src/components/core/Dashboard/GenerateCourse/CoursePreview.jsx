import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPlay, FaBookOpen, FaClock, FaUser, FaGraduationCap, FaEdit, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ThumbnailSelector from './ThumbnailSelector';
import { COURSE_GENERATION_ENDPOINTS, createApiHeaders, makeApiCall } from '../../../../utils/apiConfig';

function CoursePreview({ courseData, onBack, onPublish }) {
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [coursePrice, setCoursePrice] = useState(0);
    const [showThumbnailSelector, setShowThumbnailSelector] = useState(true);
    const { token } = useSelector((state) => state.auth);

    // Auto-scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleThumbnailSelect = (thumbnail) => {
        setSelectedThumbnail(thumbnail);
        console.log('Thumbnail selected:', thumbnail);
    };

    const handlePublishCourse = async () => {
        if (!selectedThumbnail) {
            toast.error('Please select a thumbnail for your course');
            return;
        }

        setIsPublishing(true);
        const toastId = toast.loading('Publishing course...');

        try {
            // Update course with selected thumbnail and price
            const updatedCourseData = {
                ...courseData,
                thumbnail: selectedThumbnail.url,
                price: coursePrice,
                status: 'Published'
            };

            const result = await makeApiCall(COURSE_GENERATION_ENDPOINTS.PUBLISH_COURSE, {
                method: 'POST',
                headers: createApiHeaders(token),
                body: JSON.stringify({
                    courseId: courseData._id,
                    thumbnail: selectedThumbnail.url,
                    price: coursePrice
                })
            });

            toast.success('Course published successfully!', { id: toastId });
            
            if (onPublish) {
                onPublish(result.data);
            }

        } catch (error) {
            console.error('Error publishing course:', error);
            let errorMessage = 'Failed to publish course. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsPublishing(false);
        }
    };

    const calculateTotalDuration = () => {
        let totalMinutes = 0;
        courseData.courseContent?.forEach(section => {
            section.subSection?.forEach(subSection => {
                const duration = subSection.timeDuration || '10-15 minutes';
                const minutes = parseInt(duration.match(/\d+/)?.[0] || '10');
                totalMinutes += minutes;
            });
        });
        return Math.round(totalMinutes / 60 * 10) / 10; // Convert to hours with 1 decimal
    };

    const totalSections = courseData.courseContent?.length || 0;
    const totalLectures = courseData.courseContent?.reduce((total, section) => 
        total + (section.subSection?.length || 0), 0) || 0;
    const totalDuration = calculateTotalDuration();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-richblack-5 mb-2">
                            Course Preview
                        </h2>
                        <p className="text-richblack-300">
                            Review your generated course and select a thumbnail before publishing
                        </p>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors"
                    >
                        Back to Generation
                    </button>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-richblack-700 p-4 rounded-lg text-center">
                        <FaBookOpen className="text-yellow-50 text-xl mx-auto mb-2" />
                        <div className="text-richblack-5 font-semibold">{totalSections}</div>
                        <div className="text-richblack-400 text-sm">Sections</div>
                    </div>
                    <div className="bg-richblack-700 p-4 rounded-lg text-center">
                        <FaPlay className="text-yellow-50 text-xl mx-auto mb-2" />
                        <div className="text-richblack-5 font-semibold">{totalLectures}</div>
                        <div className="text-richblack-400 text-sm">Lectures</div>
                    </div>
                    <div className="bg-richblack-700 p-4 rounded-lg text-center">
                        <FaClock className="text-yellow-50 text-xl mx-auto mb-2" />
                        <div className="text-richblack-5 font-semibold">{totalDuration}h</div>
                        <div className="text-richblack-400 text-sm">Duration</div>
                    </div>
                    <div className="bg-richblack-700 p-4 rounded-lg text-center">
                        <FaGraduationCap className="text-yellow-50 text-xl mx-auto mb-2" />
                        <div className="text-richblack-5 font-semibold capitalize">{courseData.difficulty || 'Beginner'}</div>
                        <div className="text-richblack-400 text-sm">Level</div>
                    </div>
                </div>
            </div>

            {/* Course Information */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-xl font-semibold text-richblack-5 mb-4">
                    {courseData.courseName}
                </h3>
                <p className="text-richblack-300 mb-4 leading-relaxed">
                    {courseData.courseDescription}
                </p>
                
                {/* What you'll learn */}
                {courseData.whatWillYouLearn && (
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-richblack-5 mb-2">
                            What you'll learn:
                        </h4>
                        <p className="text-richblack-300">
                            {courseData.whatWillYouLearn}
                        </p>
                    </div>
                )}

                {/* Tags */}
                {courseData.tag && courseData.tag.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-richblack-5 mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                            {courseData.tag.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-richblack-700 text-richblack-5 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructor Info */}
                <div className="flex items-center gap-2 text-richblack-300">
                    <FaUser className="text-yellow-50" />
                    <span>Created by {courseData.instructor?.firstName} {courseData.instructor?.lastName}</span>
                </div>
            </div>

            {/* Thumbnail Selection */}
            {showThumbnailSelector && (
                <ThumbnailSelector
                    courseTopic={courseData.courseName}
                    selectedThumbnail={selectedThumbnail}
                    onThumbnailSelect={handleThumbnailSelect}
                />
            )}

            {/* Course Content Preview */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    Course Content
                </h3>
                <div className="space-y-4">
                    {courseData.courseContent?.map((section, sectionIndex) => (
                        <div key={section._id} className="border border-richblack-600 rounded-lg">
                            <div className="bg-richblack-700 p-4 rounded-t-lg">
                                <h4 className="text-richblack-5 font-medium">
                                    Section {sectionIndex + 1}: {section.sectionName}
                                </h4>
                                <p className="text-richblack-400 text-sm mt-1">
                                    {section.subSection?.length || 0} lectures
                                </p>
                            </div>
                            <div className="p-4 space-y-2">
                                {section.subSection?.map((subSection, subIndex) => (
                                    <div key={subSection._id} className="flex items-center justify-between py-2 border-b border-richblack-600 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <FaPlay className="text-yellow-50 text-sm" />
                                            <span className="text-richblack-5 font-medium">
                                                {subSection.title}
                                            </span>
                                        </div>
                                        <span className="text-richblack-400 text-sm">
                                            {subSection.timeDuration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing and Publish Section */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    Course Pricing & Publishing
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pricing */}
                    <div>
                        <label className="block text-richblack-5 text-sm font-medium mb-2">
                            Course Price (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="100"
                            value={coursePrice}
                            onChange={(e) => setCoursePrice(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-50"
                            placeholder="Enter course price (0 for free)"
                        />
                        <p className="text-richblack-400 text-sm mt-1">
                            Set to 0 to make this course free
                        </p>
                    </div>

                    {/* Thumbnail Preview */}
                    <div>
                        <label className="block text-richblack-5 text-sm font-medium mb-2">
                            Selected Thumbnail
                        </label>
                        {selectedThumbnail ? (
                            <div className="relative">
                                <img
                                    src={selectedThumbnail.smallUrl}
                                    alt="Selected thumbnail"
                                    className="w-full h-24 object-cover rounded-lg border border-richblack-600"
                                />
                                <button
                                    onClick={() => setShowThumbnailSelector(!showThumbnailSelector)}
                                    className="absolute top-2 right-2 p-1 bg-richblack-800/80 text-richblack-5 rounded hover:bg-richblack-700/80"
                                >
                                    <FaEdit className="text-sm" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-24 bg-richblack-700 border border-richblack-600 rounded-lg flex items-center justify-center">
                                <span className="text-richblack-400">No thumbnail selected</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Publish Button */}
                <div className="flex justify-end mt-6 pt-4 border-t border-richblack-600">
                    <button
                        onClick={handlePublishCourse}
                        disabled={isPublishing || !selectedThumbnail}
                        className="flex items-center gap-2 px-8 py-3 bg-yellow-50 text-richblack-900 font-medium rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-richblack-900"></div>
                                Publishing...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                Publish Course
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CoursePreview;