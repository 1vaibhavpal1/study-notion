import React, { useState } from 'react'
import { HighlightText } from './HighlightText'
import { HomePageExplore } from '../../../data/homepage-explore'
import { CourseCard } from './CourseCard';
const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];
export const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);
    
    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    };

    return (
        <div className="relative flex flex-col gap-6 items-center">
            <p className="text-4xl font-semibold">Unlock the <HighlightText text={"Power of Code"} /></p>
            <p className="text-richblack-400 font-semibold text-lg -mt-4">Learn to Build Anything You Can Imagine</p>
            {/* Tabs Section */}
            <div className="flex flex-row gap-[3rem]  bg-richblack-800 px-4 py-2 rounded-full text-richblack-200 shadow-richblack-300 shadow-[0px_2px_0px_0px]">
                {tabsName.map((element, index) => {
                    return (
                        <div key={index}
                        className={`${currentTab === element ? "bg-richblack-900 text-richblack-5" : "text-richblack-200"} px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
                        onClick={() => setMyCard(element)}>
                            {element}
                        
                        </div>
                    )
                })}
            </div>
            <div className="hidden lg:block lg:h-[12rem]"></div>
            
            {/* Cards Group */}
            <div className="flex flex-row gap-12 absolute top-[60%]">
            {courses.map((course,index) => {
                    return(
                        <CourseCard
                        key={index}
                        cardData = {course}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                        />
                    )
                })}
            </div>

        </div>
    )
}
