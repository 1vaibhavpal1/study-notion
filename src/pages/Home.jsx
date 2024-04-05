import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from '../components/core/HomePage/HighlightText';
import { Link } from 'react-router-dom';
import { Button } from '../components/core/HomePage/Button';
import video1 from '../assets/Images/banner.mp4'
import { CodeBlocks } from '../components/core/HomePage/CodeBlocks';
import { TimelineSection } from '../components/core/HomePage/TimelineSection';
import { LearningLanguageSections } from '../components/core/HomePage/LearningLanguageSections';
import { InstructorSections } from '../components/core/HomePage/InstructorSections';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import Footer from '../components/common/Footer';
export const Home = () => {
    return (
        <div className="bg-richblack-900 h-full mt-[4rem]">
            {/* Section 1 */}
            <div className="mx-auto flex flex-col items-center w-10/12 gap-8 text-white">
                {/* Button */}
                <Link to="/signup">
                    <div className="flex items-center gap-4 text-richblack-200 bg-richblack-700 py-1 px-6 rounded-full
                    shadow-[0_1.5px_rgba(255,255,255,0.25)] border-richblack-700 border-4 transition-all duration-200 hover:scale-95 hover:shadow-none 
                    hover:bg-richblack-900 ">
                        <button className=" text-richblack-200">Become an Instructor</button>
                        <FaArrowRight />
                    </div>
                </Link>

                {/* Text */}
                <div className="text-center text-4xl font-semibold mt-7">Empower your future with
                    <HighlightText text=" Coding Skills"></HighlightText>
                </div>
                <div className="-mt-4 text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world,
                    and get access to a wealth of resources, including hands-on projects, quizzes,
                    and personalized feedback from instructors.
                </div>

                {/* Buttons */}
                <div className="flex gap-7 mt-8">
                    <Button active={true} linkto="/signup">
                        Learn More
                    </Button>
                    <Button active={false} linkto="/login">
                        Book a demo
                    </Button>
                </div>

                {/* VIDEO */}
                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video className="shadow-[20px_20px_rgba(255,255,255,1)]" muted loop autoPlay>
                        <source src={video1} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1 */}
                <div>
                    <CodeBlocks
                        position={"flex-row"}
                        heading={
                            <div className="text-4xl font-semibold"> Unlock your
                                <HighlightText text=" coding potential " />
                                with our online courses.
                            </div>
                        }
                        subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

                        ctabtn1={{
                            btnText: "Continue Lesson",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-yellow-25"}
                        codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={"flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold"> Start
                                <HighlightText text=" coding in seconds " />
                            </div>
                        }
                        subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

                        ctabtn1={{
                            btnText: "Try it yourself",
                            link: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false,
                        }}
                        codeColor={"text-white"}
                        codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>

                {/* Explore More Section */}
                <ExploreMore/>

            </div>

            {/*Section-2 */}
            <div className="bg-pure-greys-5 text-richblack-700 ">
                <div className="homepage_bg h-[20rem]">
                    <div className="flex flex-col items-center mx-auto w-11/12 ">
                        <div className="h-[12rem]"></div>
                        <div className="flex flex-row font-bold gap-8">
                            <Button active={true} linkto="/signup">
                                <div className="flex flex-row items items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </Button>
                            <Button active={false} linkto="/signup">Learn More</Button>
                        </div>
                    </div>
                </div>

                
                <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8">
                    {/* Jobs in demand(SubSection-1) */}
                    <div className="flex flex-row gap-32 mt-24">
                        <div className="text-4xl font-semibold w-[70%]">
                            Get the skills you need for a
                            <HighlightText text={"job that is in demand."}></HighlightText>
                        </div>
                        <div className="flex flex-col items-start ml-[6rem] w-[63%] gap-8">
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        <Button active={true} linkto="/signup"><p className="font-bold">Learn More</p></Button>
                        </div>
                    </div>
                    
                    {/* Time line Section */}
                    <TimelineSection/>
                    
                    {/* Learning Language Section - Section 3 */}
                    <LearningLanguageSections/>
                </div>
                <div className="h-[5rem]"></div>

            </div>

            {/* {Section-3} */}
            <div className="w-[11/12] text-white mx-auto max-w-maxContent  flex flex-col items-center justify-between gap-8">
                {/* Become an instructor section */}
                <InstructorSections/>

                {/* Reviews from other learners */}
                <p className="text-3xl font-semibold">Reviews from other learners</p>
                {/* <ReviewSlider /> */}
            </div>

            {/* Footer */}
            <Footer/>

        </div>
    )
}
