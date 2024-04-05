import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { RiEditBoxLine } from "react-icons/ri"
import formattedDate from "../../../utils/dateFormatter";

function MyProfile() {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    console.log(user);
    // console.log(user?.additionalDetails?.about)

    return (
        <div className="max-h-screen overflow-y-hidden">
            <h1 className="mb-12 text-3xl font-medium text-richblack-5">My Profile</h1>

            <div className="flex flex-col gap-7">
                <div className="flex justify-between items-center p-5 px-12 border-richblack-700 bg-richblack-800 rounded-md border-[1px]">
                    <div className="flex gap-3">
                        <img src={user.image} className="w-[78px] aspect-square rounded-full object-cover" />
                        <div className="flex flex-col items-start justify-center">
                            <p className="text-lg font-semibold text-richblack-5">{user.firstName + " " + user.lastName}</p>
                            <p className="text-sm text-richblack-300">{user.email}</p>
                        </div>
                    </div>
                    <div>
                        <IconBtn text="Edit" onclick={() => { navigate("/dashboard/settings") }}>
                            <RiEditBoxLine />
                        </IconBtn>
                    </div>
                </div>

                <div className="flex justify-between p-5 px-12 border-richblack-700 bg-richblack-800 rounded-md border-[1px]">
                    <div className="flex flex-col gap-10 justify-between items-start ">
                        <h2 className="text-lg font-semibold text-richblack-5">About</h2>
                        <div className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"}  text-sm font-medium`}>
                            {user?.additionalDetails?.about ?? "Write something about yourself"}
                        </div>
                    </div>
                    <div>
                        <IconBtn text="Edit" onclick={() => { navigate("/dashboard/settings") }}><RiEditBoxLine /></IconBtn>
                    </div>

                </div>

                <div className="flex justify-between items-start p-5 px-12 border-richblack-700 bg-richblack-800 rounded-md border-[1px]">
                    <div className="flex lg:w-[45%] justify-between">
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">First Name</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.firstName}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">Email</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.email}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">Gender</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.additionalDetails?.gender ?? "Add Gender"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">Last Name</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                                <p className="text-sm font-medium text-richblack-5">
                                    {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                                        "Add Date Of Birth"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <IconBtn text="Edit" onclick={() => { navigate("/dashboard/settings") }} ><RiEditBoxLine/></IconBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile