import React from 'react'
import Template from '../components/core/Auth/Template'
import loginImg from "../assets/Images/login.webp"
function Login(){
  return (
    <div>
        <Template
        title="Welcome Back"
        description1 = "Build Slills for today, tommorow, and beyond."
        description2 = "Education to future-proof your career."
        image={loginImg}
        formType="login"
        />
    </div>
  )
}
export default Login
