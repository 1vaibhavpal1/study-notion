import { useForm } from "react-hook-form";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import { useSelector } from "react-redux";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn";
import { useState } from "react";

function UpdatePassword() {
    const { token } = useSelector((state) => state.auth)

    const [showOldPassword, setShowOldPassword] = useState();
    const [showNewPassword, setShowNewPassword] = useState();

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const submitPasswordForm = async (data) => {
        try {
            await changePassword(token, data)
        }
        catch (error) {
            console.log("Change password error......", error)
        }
    }

    return (
        <div className="flex flex-col gap-4 ">


            <form onSubmit={handleSubmit(submitPasswordForm)} >
                <div className="space-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

                    <div className="flex justify-between items-center w-[100%]">
                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label className="lable-style" htmlFor="currPassword">Current Password</label>
                            <input
                                name="currPassword"
                                id="currPassword"
                                placeholder="Enter Current Password"
                                className="form-style"
                                type={`${showOldPassword ? "text" : "password"}`}
                                {...register("currPassword", { required: true })}
                            />
                            <span className="absolute bottom-3 right-2 cursor-pointer" onClick={() => setShowOldPassword((prev) => !prev)}>{
                                showOldPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"  />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF"  />)
                            }</span>
                            {errors.currPassword && (<span className="-mt-1 text-[12px] text-yellow-100">Please enter correct Password</span>)}
                        </div>

                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="newPassword" className="lable-style">New Password</label>
                            <input
                                name="newPassword"
                                id="newPassword"
                                placeholder="Enter new Password"
                                type={`${showNewPassword ? "text" : "password"}`}
                                className="form-style"
                                {...register("newPassword", { required: true })}
                            />
                            <span className="absolute bottom-3 right-2" onClick={() => setShowNewPassword((prev) => !prev)}>
                                {
                                    showNewPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"  />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF"  />)
                                }
                            </span>
                            {errors.newPassword && (<span className="-mt-1 text-[12px] text-yellow-100">Please enter your New Password</span>)}
                        </div>
                    </div>

                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button className="bg-richblack-700 text-richblack-50 font-semibold py-2 px-5 cursor-pointer rounded-md" onClick={() => navigate("/dashboard/my-profile")}>Cancel</button>
                    <IconBtn type="submit" text="Update" />
                </div>
            </form>

        </div>
    )
}

export default UpdatePassword