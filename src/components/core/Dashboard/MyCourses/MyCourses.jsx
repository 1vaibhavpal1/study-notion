import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc"
import CourseTable from "./CourseTable";

function MyCourses() {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses , setCourses] = useState([])

    const fetchAllCourses = async () => {
        let result = await fetchInstructorCourses(token)
        if(result){
            setCourses(result)
        }
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])
    return (
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h2 className="text-3xl font-medium text-richblack-5">My Courses</h2>

                <IconBtn text="Add Course" onclick={() => navigate("/dashboard/add-course")}>
                    <VscAdd />
                </IconBtn>
            </div>
            
            { courses && <CourseTable courses={courses} setCourses={setCourses} />}
        </div>
    )
}

export default MyCourses