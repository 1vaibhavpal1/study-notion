import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md"
const { useEffect, useState } = require("react");

function ChipInput({ label, name, placeholder, register, errors, setValue }) {

    const { editCourse, course } = useSelector((state) => state.course)

    //Settings up state for managing chips 
    const [chips, setChips] = useState([])

    // console.log("Course ==> ", course)

    useEffect(() => {
        if (editCourse) {
            setChips(course?.tag)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
    }, [])

    useEffect(() => {
        setValue(name, chips)
    }, [chips])


    const handleKeyDown = (event) => {

        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault()

            console.log("EVENT IS ===>>", event)
            const chipValue = event.target.value.trim()

            if (chipValue && !chips.includes(chipValue)) {

                const newChips = [...chips, chipValue]
                setChips(newChips)
                event.target.value = ""
            }

        }
    }

    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((_, index) => index !== chipIndex)  //Why underscore here
        setChips(newChips)
    }

    return (
        <div className="flex flex-col space-y-2">
            {/* Render the label for the input */}
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex w-full flex-wrap gap-2">
                {chips.map((chip, index) => (
                    <div key={index} className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5">
                        {chip}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))}
                {/* Render the input for adding new chips */}
                <input
                    id={name}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="form-style w-full"
                />
            </div>
            {/* Render an error message if the input is required and not filled */}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}

        </div>
    )
}

export default ChipInput