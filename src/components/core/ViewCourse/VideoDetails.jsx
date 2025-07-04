import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

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

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData || !courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        
        // Add safety checks for filtered data
        if (filteredData && filteredData.length > 0 && filteredData[0]?.subSection) {
          const filteredVideoData = filteredData[0].subSection.filter(
            (data) => data._id === subSectionId
          )
          // console.log("filteredVideoData", filteredVideoData)
          
          // Safety check for video data
          if (filteredVideoData && filteredVideoData.length > 0) {
            setVideoData(filteredVideoData[0])
          } else {
            setVideoData(null)
          }
        } else {
          setVideoData(null)
        }
        
        setPreviewSource(courseEntireData?.thumbnail || "")
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    if (!courseSectionData || !courseSectionData.length) return true
    
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return true

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)
    if (!courseSectionData || !courseSectionData.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx === -1) return

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      // Check if next subsection exists
      const nextSubSection = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]
      if (nextSubSection?._id) {
        navigate(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection._id}`
        )
      }
    } else {
      // Check if next section exists
      const nextSection = courseSectionData[currentSectionIndx + 1]
      if (nextSection?._id && nextSection?.subSection && nextSection.subSection.length > 0) {
        const nextSubSectionId = nextSection.subSection[0]._id
        navigate(
          `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`
        )
      }
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    if (!courseSectionData || !courseSectionData.length) return true
    
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return true

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx === -1) return true

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)
    if (!courseSectionData || !courseSectionData.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx === -1) return

    if (currentSubSectionIndx !== 0) {
      // Check if previous subsection exists
      const prevSubSection = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]
      if (prevSubSection?._id) {
        navigate(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSection._id}`
        )
      }
    } else {
      // Check if previous section exists
      const prevSection = courseSectionData[currentSectionIndx - 1]
      if (prevSection?._id && prevSection?.subSection && prevSection.subSection.length > 0) {
        const prevSubSectionLength = prevSection.subSection.length
        const prevSubSectionId = prevSection.subSection[prevSubSectionLength - 1]._id
        navigate(
          `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSectionId}`
        )
      }
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  // Check if the video URL is a YouTube link
  const isYouTube = isYouTubeUrl(videoData?.videoUrl);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoData?.videoUrl);

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : isYouTube ? (
        <div className="relative">
          <iframe
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-96 w-full rounded-md"
          ></iframe>
          {/* Render When Video Ends - For YouTube, we'll show completion options */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  setVideoEnded(false)
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
// video