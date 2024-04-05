import { HighlightText } from "../components/core/HomePage/HighlightText"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannnerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from "../components/core/About/Quote"
import FoundingStory from "../assets/Images/FoundingStory.png"
import Stats from "../components/core/About/Stats"
import LearningGrid from "../components/core/About/LearningGrid"
import ContactFormSection from "../components/core/About/ContactFormSection"
import Footer from "../components/common/Footer"

function About() {
    return (
        <div className="text-white mx-auto">
            {/* //Section-1 */}
            <div className="bg-richblack-700">
                <section className="relative mx-auto w-11/12 max-w-maxContent flex flex-col justify-center items-center text-white text-center ">
                    <div className="py-20 text-center">
                        <div className="mx-auto text-4xl font-semibold lg:w-[55%]">Driving Innovation in Online Education for a
                            <HighlightText text="Brighter Future" />
                        </div>
                        <p className="mx-auto mt-3 text-base font-medium text-richblack-300 lg:w-[85%]">Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
                    </div>
                    <div className="h-[150px]"></div>
                    <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                        <img src={BannerImage1} />
                        <img src={BannnerImage2} />
                        <img src={BannerImage3} />
                    </div>
                </section>
            </div>

            <section className="border-b border-richblack-700">
                <div className="mx-auto text-center flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                    <div className="h-[100px]"></div>
                    <Quote />
                </div>
            </section>

            {/* //Section-2 */}
            <section className="flex flex-col gap-[5rem] mx-auto w-11/12 max-w-maxContent ">
                <div className="my-24 flex flex-row justify-between">
                    <div className="flex lg:w-[50%] flex-col gap-10">
                        <h3 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">Our Founding Story</h3>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            Our e-learning platform was born out of a shared vision and
                            passion for transforming education. It all began with a group of
                            educators, technologists, and lifelong learners who recognized
                            the need for accessible, flexible, and high-quality learning
                            opportunities in a rapidly evolving digital world.
                        </p>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            As experienced educators ourselves, we witnessed firsthand the
                            limitations and challenges of traditional education systems. We
                            believed that education should not be confined to the walls of a
                            classroom or restricted by geographical boundaries. We
                            envisioned a platform that could bridge these gaps and empower
                            individuals from all walks of life to unlock their full
                            potential.
                        </p>
                    </div>
                    <div>
                        <img
                            src={FoundingStory}
                            alt=""
                            className="shadow-[0px_0px_20px_0] shadow-[#FC6767]"
                        />
                    </div>
                </div>
                <div className=" my-24 flex flex-row justify-between">
                    <div className="lg:w-[40%] flex flex-col gap-10">
                        <h3 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">Our Vision</h3>
                        <p className="text-base font-medium text-richblack-300 ">With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                    </div>
                    <div className=" lg:w-[40%] flex flex-col gap-10">
                        <h3 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">Our Mission</h3>
                        <p className="text-base font-medium text-richblack-300 ">Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                    </div>
                </div>
            </section>

            <Stats />
            <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                <LearningGrid />
                <ContactFormSection />
            </section>

            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                {/* <ReviewSlider /> */}
                {/* <ReviewSlider /> */}
            </div>
            {/* <Footer /> */}
            <Footer />

        </div>
    )
}
export default About;