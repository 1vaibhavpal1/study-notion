import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png";
import { HighlightText } from './HighlightText';
import { Button } from './Button';
import { FaArrowRight } from 'react-icons/fa';
export const InstructorSections = () => {
    return (
        <div className="flex flex-row items-center gap-20 my-20">
            <div className="w-[50%]">
                <img
                    src={Instructor}
                    alt=""
                    className="shadow-white shadow-[-20px_-20px_0px_0px]"
                />
            </div>
            <div className='flex flex-col gap-10 w-[45%]'>
                <p className="w-[50%] text-4xl font-semibold">Become an
                    <HighlightText text={"Instructor"} />
                </p>
                <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">Instructors from around the world teach
                    millions of students on StudyNotion. We provide the tools and skills to teach what you love
                .</p>
                <div className="w-fit">
                <Button active={true} linkto="/signup">
                    <div className="flex flex-row items-center gap-3 font-bold">
                    Start Teaching Today 
                    <FaArrowRight/>
                    </div>
                </Button>
            </div>
            </div>
            
        </div>
    )
}
