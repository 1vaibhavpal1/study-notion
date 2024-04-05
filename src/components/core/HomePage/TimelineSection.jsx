import React from 'react'
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
const TimeLine = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];
export const TimelineSection = () => {
    return (
        <div className="flex flex-row gap-20 mt-20 items-center">
            <div className="flex flex-col gap-3 w-[45%]">
                {TimeLine.map((element, index) => {
                    return (
                        <div className="flex flex-col gap-2 items-start" key={index}>
                            <div className="flex gap-6" key={index}>
                                <div className="bg-white h-[3.5rem] w-[3.5rem] rounded-full flex items-center justify-center shadow-[#00000012] shadow-[0_0_62px_0]">
                                    <img src={element.Logo} alt="/"></img>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[1.2rem]">{element.Heading}</h2>
                                    <p className="text-base">{element.Description}</p>
                                </div>
                            </div>
                            <div className={`${TimeLine.length-1 === index ? "hidden" : "lg:block"} h-14 border-dotted border-richblack-100 border-r w-[2rem] self-start -ml-1`}></div>
                        </div>
                    )
                })}
            </div>
            <div className="relative shadow-blue-200 shadow-[0px_0px_30px_0px] w-fit h-fit">
                <img src={TimeLineImage} alt="timeline" className="h-fit object-cover shadow-white shadow-[20px_20px_0px_0px]"/>
                <div className="absolute flex flex-row bg-caribbeangreen-700  left-[50%] bottom-0 translate-x-[-50%] translate-y-[50%] py-10 text-white">
                    <div className="flex flex-row items-senter gap-5 px-14">
                        <h2 className="text-3xl font-bold w-[75px]">10</h2>
                        <h3 className="text-caribbeangreen-300 text-sm w-[75px] uppercase">Years experiences</h3>
                    </div>
                    <div className="flex flex-row gap-5 items-center px-14">
                        <h3 className="text-3xl font-bold w-[75px]">250</h3>
                        <h3 className="text-caribbeangreen-300 text-sm w-[75px] uppercase">types of courses</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
