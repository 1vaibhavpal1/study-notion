import React from 'react'
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

export const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
    return (
        <div className={`flex flex-col justify-between h-[18.75rem] w-[22rem] ${cardData.heading === currentCard ? "bg-white text-richblack-500 shadow-yellow-50 shadow-[10px_10px_0px_0px]" : "bg-richblack-800 text-richblack-400"} pt-[1.5rem]  `}
        onClick={(() => setCurrentCard(cardData.heading))}>
            <div className="px-[1.7rem]">
                <p className={`${cardData.heading === currentCard ? "text-richblack-800" : "text-richblack-25"} text-xl font-semibold`}>{cardData.heading}</p>
                <p className={`mt-4 text-richblack-500 ${cardData.heading === currentCard ? "text-richblack-500" : "text-richblack-400"}`}>{cardData.description}</p>
            </div>

            <div className={`h-[3rem] py-3 flex justify-between font-medium border-richblack-400 border-t-2 border-dashed ${cardData.heading === currentCard ? "text-blue-400" : "text-richblack-400"}`}>
                <div className="flex items-center gap-2 pl-[1.5rem]">
                    <HiUsers/>
                    {cardData.level}
                </div>
                <div className="flex items-center gap-2 pr-[1.5rem]">
                    <ImTree/>
                    {cardData.lessionNumber}
                    <p>Lessions</p>
                </div>
            </div>
        </div>
    )
}
