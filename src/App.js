import PrivateRoute from "./components/core/Auth/PrivateRoute"
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OpenRoute from './components/core/Auth/OpenRoute';
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import { useSelector } from "react-redux";
import Cart from "./components/core/Cart/index"
import { ACCOUNT_TYPE } from './utils/constants'
import AddCourse from "./components/core/Dashboard/AddCourse/index"
import GenerateCourse from "./components/core/Dashboard/GenerateCourse/index"

import Contact from './pages/Contact';
import Dashboard from './pages/Dashboards';
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/index";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import MyCourses from "./components/core/Dashboard/MyCourses/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/index";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor  from "./components/core/Dashboard/InstructorDashboard/Instructor";


function App() {
    const { user } = useSelector((state) => state.profile)
    return (
        <div className='min-h-screen bg-richblack-900 font-inter overflow-x-hiddenn'>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path="/catalog/:categoryName" element={<Catalog/>} />
                <Route path="courses/:courseId" element={<CourseDetails/>} />
                <Route path='login' element={
                    <OpenRoute>
                        <Login />
                    </OpenRoute>
                }
                />
                <Route path='signup' element={
                    <OpenRoute>
                        <Signup />
                    </OpenRoute>
                }
                />
                <Route path='forgot-password' element={
                    <OpenRoute>
                        <ForgotPassword />
                    </OpenRoute>
                }
                />

                <Route path='update-password/:id' element={
                    <OpenRoute>
                        <UpdatePassword />
                    </OpenRoute>
                } />

                <Route path='verify-email' element={
                    <OpenRoute>
                        <VerifyEmail />
                    </OpenRoute>
                } />

                <Route path='about' element={
                    <OpenRoute>
                        <About />
                    </OpenRoute>
                } />

                <Route path='/contact' element={
                    <Contact />
                }
                />

                <Route element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }>
                    <Route path="dashboard/my-profile" element={<MyProfile />} />
                    <Route path="dashboard/settings" element={<Settings />} />


                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route path="dashboard/cart" element={<Cart />} />
                                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                            </>
                        )
                    }
                    {
                        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                            <>
                            <Route path="dashboard/instructor" element={<Instructor/>}/>
                            <Route path="dashboard/add-course" element={<AddCourse/>}/>
                            <Route path="dashboard/generate-course" element={<GenerateCourse/>}/>
                            <Route path="dashboard/my-courses" element={<MyCourses/>} />
                            <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />
                            </>
                        )
                    }

                </Route>

                <Route element={
                    <PrivateRoute>
                        <ViewCourse/>
                    </PrivateRoute>
                }>
                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                            <Route
                             path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                             element={<VideoDetails/>}
                             />
                            </>
                        )
                    }
                </Route>





            </Routes>
        </div>
    )
}

export default App;
