import React from 'react'

export const HighlightText = ({ text }) => {
    return (
        <span className="bg-gradient-to-t from-gradient-100 via-gradient-200 to-gradient-300  h-[3.2rem] text-transparent bg-clip-text">
            {" "}
            {text}
        </span>
    )
}
