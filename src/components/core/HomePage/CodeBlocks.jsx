import React from 'react'
import { Button } from './Button'
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';


export const CodeBlocks = ({
    position,
    heading,
    subheading,
    ctabtn1,
    ctabtn2,
    codeblock,
    codeColor,
    backgroundGradient,
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>
            {/* Section-1 */}
            <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
                {heading}
                <div className="w-[85%] -mt-3 text-richblack-300 text-base font-bold">
                    {subheading}
                </div>


                <div className="flex gap-7 mt-7">
                    <Button linkto={ctabtn1.link} active={ctabtn1.active}>
                        <div className='flex items-center gap-2 font-bold'>
                            {ctabtn1.btnText}
                            <FaArrowRight />
                        </div>
                    </Button>
                    <Button linkto={ctabtn2.link} active={ctabtn2.active}>
                        {ctabtn2.btnText}
                    </Button>
                </div>
            </div>
            {/*Section-2*/}
            <div className="w-[100%] code-border lg:w-[470px] flex flex-row py-3 code-border h-fit relative">
                {backgroundGradient}
                {/* Indexing */}
                <div className="text-center w-[10%] select-none font-bold text-richblack-400">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

                {/* codes */}
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                    <TypeAnimation
                        sequence={[codeblock, 1000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block"
                        }}
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>
        </div>
    )
}
