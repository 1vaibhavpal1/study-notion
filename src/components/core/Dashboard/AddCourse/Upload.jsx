import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

// Helper function to check if URL is a YouTube link
const isYouTubeUrl = (url) => {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
};

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    
    // Handle youtu.be links
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle youtube.com links
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1];
        // Remove any additional parameters
        const cleanVideoId = videoId.split('&')[0];
        return `https://www.youtube.com/embed/${cleanVideoId}`;
    }
    
    // Handle youtube.com/embed links (already in correct format)
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    return url;
};

export default function Upload({ name, label, register, setValue, errors, video = false, viewData = null, editData = null }) {
    const course = useSelector((state) => state.course)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    )
    const inputRef = useRef(null)

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            previewFile(file)
            setSelectedFile(file)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
            ? { "image/*": [".jpeg", ".jpg", ".png"] }
            : { "video/*": [".mp4"] },
        onDrop,
    })

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    useEffect(() => {
        register(name, { required: true })
    }, [register])

    useEffect(() => {
        setValue(name, selectedFile)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile, setValue])

    // Check if the preview source is a YouTube URL
    const isYouTube = isYouTubeUrl(previewSource);
    const youtubeEmbedUrl = getYouTubeEmbedUrl(previewSource);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>
            <div
                className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"
                    } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
            >
                {previewSource ? (
                    <div className="flex w-full flex-col p-6">
                        {!video ? (
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="h-full w-full rounded-md object-cover"
                            />
                        ) : isYouTube ? (
                            <div className="w-full">
                                <iframe
                                    src={youtubeEmbedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="h-64 w-full rounded-md"
                                ></iframe>
                            </div>
                        ) : (
                            <Player aspectRatio="16:9" playsInline src={previewSource} />
                        )}
                        {!viewData && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewSource("")
                                    setSelectedFile(null)
                                    setValue(name, null)
                                }}
                                className="mt-3 text-richblack-400 underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="flex w-full flex-col items-center p-6"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} ref={inputRef} />
                        <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                            <FiUploadCloud className="text-2xl text-yellow-50" />
                        </div>
                        <p onClick={(e)=> {e.preventDefault();
    if (inputRef.current) inputRef.current.click();}} className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                            Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                            <span className="font-semibold text-yellow-50">Browse</span> a
                            file
                        </p>
                        <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                            <li>Aspect ratio 16:9</li>
                            <li>Recommended size 1024x576</li>
                        </ul>
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    )

}