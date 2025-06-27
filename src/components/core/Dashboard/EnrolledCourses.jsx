
import { useSelector } from "react-redux"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProgressBar from "@ramonak/react-progress-bar"

function EnrolledCourses() {

    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const [enrolledCourses, setEnrolledCourses] = useState(null)
    const [loading, setLoading] = useState(true)
    
    async function getEnrolledCourses() {
        try {
            setLoading(true)
            const res = await getUserEnrolledCourses(token)
            console.log("Enrolled courses data ==>>>", res)
            // Ensure we always have an array
            setEnrolledCourses(Array.isArray(res) ? res : [])
        }
        catch (err) {
            console.log("Error in fetching course", err)
            setEnrolledCourses([]) // Set empty array on error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    }, [])

    return (
        <div>
            <div>Enrolled Courses</div>
            {loading ?
                (<div className="grid h-full place-items-center">
                    <div className="spinner"></div>
                </div>) : !enrolledCourses || !enrolledCourses.length ?
                    (<div className="grid h-[100vh] w-full place-content-center text-richblack-5">You have not enrolled in any course yet</div>)
                    : (<div className="my-8 text-richblack-5">
                        {/* Headings */}
                        <div className="flex rounded-t-lg bg-richblack-500 ">
                            <p className="w-[45%] px-5 py-3">Course Name</p>
                            <p className="w-1/4 px-2 py-3">Duration</p>
                            <p className="flex-1 px-2 py-3">Progress</p>
                        </div>
                        {/* Course Names */}
                        {enrolledCourses && enrolledCourses.map((course, i, arr) => (
                            <div
                                className={`flex items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                                    }`}
                                key={i}
                            >
                                <div
                                    className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                    onClick={() => {
                                        // Check if course has content before navigation
                                        if (course?._id && course.courseContent && course.courseContent.length > 0) {
                                            const firstSection = course.courseContent[0];
                                            if (firstSection?._id && firstSection.subSection && firstSection.subSection.length > 0) {
                                                navigate(
                                                    `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSection.subSection[0]._id}`
                                                );
                                            } else {
                                                // Fallback: navigate to course overview if no subsections
                                                navigate(`/view-course/${course._id}`);
                                            }
                                        } else {
                                            // Fallback: navigate to course details if no content
                                            navigate(`/courses/${course._id}`);
                                        }
                                    }}
                                >
                                    <img
                                        src={course?.thumbnail || "/api/placeholder/56/56"}
                                        alt="course_img"
                                        className="h-14 w-14 rounded-lg object-cover"
                                    />
                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course?.courseName || "Course Name"}</p>
                                        <p className="text-xs text-richblack-300">
                                            {course?.courseDescription && course.courseDescription.length > 50
                                                ? `${course.courseDescription.slice(0, 50)}...`
                                                : course?.courseDescription || "No description available"}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                    <p>Progress: {course.progressPercentage || 0}%</p>
                                    <ProgressBar
                                        completed={course.progressPercentage || 0}
                                        height="8px"
                                        isLabelVisible={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>)
            }
        </div>
    )
}

export default EnrolledCourses