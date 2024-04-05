import React from 'react'
import { HighlightText } from './HighlightText'
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg"
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";
import { Button } from './Button';
export const LearningLanguageSections = () => {
    return (
        <div className="flex flex-col items-center justify-evenly mt-20 w-[100%]">
            <div className="flex gap-3 font-bold text-4xl">
                Your swiss knife 
                <HighlightText text={" for learning any language"}></HighlightText>
            </div>
            <div className="w-[75%] text-richblack-700 font-medium text-center mt-2">
                Using spin making learning multiple languages easy. with 20+
                languages realistic voice-over, progress tracking, custom schedule
                and more.
            </div>
            <div className="flex flex-row items-center justify-center mt-0 mb-4">
                <img
                    src={Know_your_progress}
                    alt=""
                    className="object-contain -mr-32"
                />
                <img
                    src={Compare_with_others}
                    alt=""
                    className="object-contain -mb-10 mt-0 "
                />
                <img
                    src={Plan_your_lessons}
                    alt=""
                    className="object-contain -ml-36 -mt-5"
                />
            </div>
            <Button active={true} linkto="/signup"><p className="font-bold">Learn More</p></Button>
        </div>
    )
}
