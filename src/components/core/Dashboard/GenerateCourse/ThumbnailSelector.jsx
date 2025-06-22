import { useState, useEffect } from 'react';
import { FaCheck, FaSpinner, FaImage, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import UnsplashService from '../../../../services/unsplashService';

function ThumbnailSelector({ courseTopic, selectedThumbnail, onThumbnailSelect, className = '' }) {
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        fetchThumbnails();
    }, [courseTopic]);

    useEffect(() => {
        // If we have a selected thumbnail URL, find its index
        if (selectedThumbnail && thumbnails.length > 0) {
            const index = thumbnails.findIndex(thumb => thumb.url === selectedThumbnail.url);
            if (index !== -1) {
                setSelectedIndex(index);
            }
        }
    }, [selectedThumbnail, thumbnails]);

    const fetchThumbnails = async () => {
        try {
            setLoading(true);
            console.log('Fetching thumbnails for topic:', courseTopic);
            
            const images = await UnsplashService.searchImages(courseTopic, 6);
            setThumbnails(images);
            
            // Auto-select first thumbnail if none selected
            if (images.length > 0 && !selectedThumbnail) {
                setSelectedIndex(0);
                onThumbnailSelect(images[0]);
            }
            
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
            toast.error('Failed to load thumbnails');
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailSelect = (thumbnail, index) => {
        setSelectedIndex(index);
        onThumbnailSelect(thumbnail);
        
        // Track download for Unsplash API requirements
        if (thumbnail.downloadUrl) {
            UnsplashService.trackDownload(thumbnail.downloadUrl);
        }
        
        toast.success('Thumbnail selected!');
    };

    const handleRefreshThumbnails = () => {
        fetchThumbnails();
        toast.loading('Loading new thumbnails...', { duration: 1000 });
    };

    if (loading) {
        return (
            <div className={`bg-richblack-800 p-6 rounded-lg border border-richblack-700 ${className}`}>
                <div className="flex items-center gap-2 mb-4">
                    <FaImage className="text-yellow-50" />
                    <h3 className="text-lg font-semibold text-richblack-5">
                        Course Thumbnail
                    </h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-richblack-300">
                        <FaSpinner className="animate-spin text-yellow-50" />
                        <span>Loading thumbnails...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-richblack-800 p-6 rounded-lg border border-richblack-700 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FaImage className="text-yellow-50" />
                    <h3 className="text-lg font-semibold text-richblack-5">
                        Choose Course Thumbnail
                    </h3>
                </div>
                <button
                    onClick={handleRefreshThumbnails}
                    className="px-3 py-1 text-sm bg-richblack-700 text-richblack-5 rounded hover:bg-richblack-600 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <p className="text-richblack-300 text-sm mb-4">
                Select a thumbnail for your course. The first image is selected by default.
            </p>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {thumbnails.map((thumbnail, index) => (
                    <div
                        key={thumbnail.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                            selectedIndex === index
                                ? 'border-yellow-50 ring-2 ring-yellow-50/50'
                                : 'border-richblack-600 hover:border-richblack-500'
                        }`}
                        onClick={() => handleThumbnailSelect(thumbnail, index)}
                    >
                        <div className="aspect-video">
                            <img
                                src={thumbnail.smallUrl}
                                alt={thumbnail.description}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedIndex === index && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-50 rounded-full flex items-center justify-center">
                                <FaCheck className="text-richblack-900 text-sm" />
                            </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {selectedIndex === index ? 'Selected' : 'Select'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected thumbnail info */}
            {thumbnails[selectedIndex] && (
                <div className="bg-richblack-700 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="text-richblack-5 font-medium mb-1">
                                Selected Thumbnail
                            </h4>
                            <p className="text-richblack-300 text-sm mb-2">
                                {thumbnails[selectedIndex].description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-richblack-400">
                                <span>Photo by</span>
                                <a
                                    href={thumbnails[selectedIndex].photographerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-50 hover:underline flex items-center gap-1"
                                >
                                    {thumbnails[selectedIndex].photographer}
                                    <FaExternalLinkAlt className="text-xs" />
                                </a>
                                <span>on Unsplash</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <img
                                src={thumbnails[selectedIndex].thumbUrl}
                                alt="Selected thumbnail"
                                className="w-16 h-10 object-cover rounded border border-richblack-600"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThumbnailSelector; 