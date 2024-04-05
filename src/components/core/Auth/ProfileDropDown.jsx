import { useDispatch, useSelector } from "react-redux"
import { AiOutlineCaretDown } from "react-icons/ai"
import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../../../services/operations/authAPI"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useState } from "react"
import useOnClickOutside from "../../../hooks/useOnClickOutside"

function ProfileDropDown() {
    const { user } = useSelector((state) => state.profile)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const ref = useRef()

    useOnClickOutside(ref,() => setOpen(false))
    return (
        <button className="relative z-10" onClick={() => setOpen(!open)}>
            {/* {console.log(open)} */}
            <div className=" flex gap-1 items-center">
                <img
                    src={user?.image}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[30px] rounded-full object-cover"
                />
                <AiOutlineCaretDown className="text-sm text-richblack-100"/>
            </div>
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[118%] right-0 divide-y-[1px] divide-richblack-700 border-[1px] overflow-hidden rounded-md bg-richblack-800 border-richblack-700"
                    ref={ref}
                >
                    <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
                        <div className="flex gap-2 h-[3rem] px-[12px] w-full items-center  text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                            <VscDashboard />
                            Dashboard
                        </div>
                    </Link>
                    <div
                    className="flex gap-2 h-[3rem] px-[12px] items-center text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
                        onClick={() => {
                            dispatch(logout(navigate))
                            setOpen(false)
                        }}
                    >
                        <VscSignOut />
                        Logout
                    </div>
                </div>
            )}

        </button>
    )
}

export default ProfileDropDown