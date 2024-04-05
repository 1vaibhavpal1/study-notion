import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi"
import { getPasswordResetToken } from "../services/operations/authAPI";

function ForgotPassword() {
    const [emailSent, setEmailSent] = useState(false);
    const { loading } = useSelector((state) => state.auth)
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    function submitHandler(e) {
        e.preventDefault()
        dispatch(getPasswordResetToken(email, setEmailSent))
    }
    return (
        <div className="flex flex-col w-full min-h-[calc(100vh-7.5rem)] items-center justify-center text-white">
            {loading ?
                (<div className="flex-col items-center justify-center gap-3">
                    <div className="spinner"></div>
                    <p className="font-xl text-white">Loading..</p>
                </div>) :
                (
                    <div className="w-[25rem] flex flex-col gap-[1.5rem] p-4 lg:p-8">
                        <h3 className="font-semibold text-[1.875rem] leading-[2.375] text-richblack-5">{!emailSent ? ("Reset Your Password") : ("Check your Mail")}</h3>
                        <p className="text-[1.125rem] leading-[1.625rem] text-richblack-100">{!emailSent ? ("Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery") : (`We have sent the reset email to ${email}`)}</p>

                        <form onSubmit={submitHandler}>
                            {!emailSent && (
                                <label className="w-full">
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5" >Email Adress<sup className="text-pink-200">*</sup></p>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email adress"
                                        className="form-style w-full text-black"
                                    ></input>
                                </label>
                            )}
                            <button className="bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 w-full rounded-[8px] mt-6" type="submit">{!emailSent ? ("Reset Password") : ("Resend Email")}</button>
                        </form>
                        <div >
                            <Link to="/login">
                                <p className="flex items-center gap-2"><BiArrowBack /> Back to login</p>
                            </Link>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default ForgotPassword