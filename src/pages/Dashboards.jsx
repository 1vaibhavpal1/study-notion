import { useSelector } from "react-redux"
import Sidebar from "../components/core/Dashboard/Sidebar"
import { Outlet } from "react-router-dom"

function Dashboard(){
    const {loading: profileLoading} = useSelector((state) => state.profile)
    const {loading: authloading} = useSelector((state) => state.auth)

    if(profileLoading || authloading){
        return(
            <div className="h-[calc(100vh-7.5rem)] grid items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return(
        <div className="relative flex min-h-[calc(100vh-7.5rem)]">
            <Sidebar/>
            <div className="min-h-[calc(100vh-7.5rem)] flex-1 overflow-hidden">
                <div className="mx-auto w-11/12 max-w-[1000px] py-8">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard