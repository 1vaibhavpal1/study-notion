import React from "react"

const Statistics = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

function Stats(){
    return(
        <div className="bg-richblack-700">
        {/* Stats */}
        <div className="flex flex-row justify-evenly text-white ">
            {Statistics.map((data,index) => {
                return(
                    <div className="flex flex-col py-10" key={{index}}>
                        <p className="text-[30px] font-bold text-richblack-5"> {data.count}</p>
                        <p className="font-semibold text-[16px] text-richblack-500">{data.label}</p>
                    </div>
                )
            })}
        </div>
    </div>
    )
}
export default Stats