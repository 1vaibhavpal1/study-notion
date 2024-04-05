import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";

function UpdatePassword() {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1)
        console.log(token)
        dispatch(resetPassword(password, confirmPassword, token, navigate))
    }

    return (
        <div className="w-full h-[calc(100vh-7.5rem)] flex flex-col gap-[1rem] items-center justify-center text-white">
            {loading ? (<div className="flex flex-col items-center jusitfy-center">
                <div className="spinner"></div>
                <p className="text-white text-xl">Loading..</p>
            </div>) : (
                <div className="flex flex-col gap-[1rem] text-white w-[23rem]">
                    <p className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">Choose new password</p>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">Almost done. Enter your new password and youre all set.</p>

                    <form onSubmit={submitHandler}>
                        <label className="relative">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">New Password<sup className="text-pink-200">*</sup></p>
                            <input
                                required
                                name="password"
                                type={showPassword ? ("text") : ("password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="form-style w-full"
                            />
                            <span className="absolute right-3 top-[2.5rem] cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? (<FaEye />) : (<FaEyeSlash />)}
                            </span>
                        </label>
                        <label className="relative mt-3 block">
                            <p>Confirm new Password<sup>*</sup></p>
                            <input
                                required
                                name="confirmPassword"
                                type={showConfirmPassword ? ("text") : ("password")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="form-style w-full"
                            />
                            <span className="absolute right-3 top-[2.5rem] cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? (<FaEye />) : (<FaEyeSlash />)}
                            </span>
                        </label>
                        <button type="submit" className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                            Reset Password
                        </button>
                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login">
                                <p className="flex items-center gap-x-2 text-richblack-5">
                                    <BiArrowBack /> Back to login
                                </p>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default UpdatePassword