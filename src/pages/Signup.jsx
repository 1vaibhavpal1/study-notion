import React from 'react'
import Template from '../components/core/Auth/Template'
import signUpImg from "../assets/Images/signup.webp"
function Signup() {
  return (
    <div>
      <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={signUpImg}
        formType="signup"
      />
    </div>
  )
}
export default Signup
