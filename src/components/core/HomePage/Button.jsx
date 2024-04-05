import React from 'react'
import { Link } from 'react-router-dom'
export const Button = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={ `shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none text-center ${active ? "bg-yellow-50 text-black" : "bg-richblack-700 text-white"}
                        px-6 py-3 rounded-lg font-semibold `}>
            {children}
        </div>
    </Link>
  )
}
