const { instance, key_id } = require("../config/Razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Create Razorpay order for payment
exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body
    const userId = req.user.id

    console.log("🔄 Starting payment capture process")
    console.log("User ID:", userId)
    console.log("Courses:", courses)

    // Validate input
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs"
      })
    }

    let totalAmount = 0
    const courseDetails = []

    // Validate each course and calculate total amount
    for (const courseId of courses) {
      try {
        const course = await Course.findById(courseId)
        
        if (!course) {
          return res.status(404).json({
            success: false,
            message: `Course with ID ${courseId} not found`
          })
        }

        // Check if user is already enrolled
        const userObjectId = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(userObjectId)) {
          return res.status(400).json({
            success: false,
            message: `You are already enrolled in course: ${course.courseName}`
          })
        }

        // Check if course is published
        if (course.status !== 'Published') {
          return res.status(400).json({
            success: false,
            message: `Course ${course.courseName} is not available for purchase`
          })
        }

        totalAmount += course.price
        courseDetails.push({
          id: course._id,
          name: course.courseName,
          price: course.price
        })

      } catch (error) {
        console.error(`Error processing course ${courseId}:`, error)
        return res.status(500).json({
          success: false,
          message: `Error processing course ${courseId}`
        })
      }
    }

    // Check if total amount is valid
    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be greater than 0"
      })
    }

    console.log("💰 Total amount:", totalAmount)
    console.log("📚 Course details:", courseDetails)

    // Create Razorpay order
    const razorpayOptions = {
      amount: totalAmount * 100, // Amount in paise (smallest currency unit)
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${userId.slice(-8)}`, // Keep under 40 chars
      notes: {
        userId: userId,
        courses: JSON.stringify(courses),
        totalCourses: courses.length
      }
    }

    console.log("🏗️ Creating Razorpay order with options:", razorpayOptions)

    const razorpayOrder = await instance.orders.create(razorpayOptions)
    
    console.log("✅ Razorpay order created successfully:", razorpayOrder.id)

    // Return order details to frontend
    return res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: key_id,
        courses: courseDetails,
        totalAmount: totalAmount
      }
    })

  } catch (error) {
    console.error("❌ Error in capturePayment:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message
    })
  }
}

// Verify Razorpay payment and enroll student
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courses
    } = req.body

    const userId = req.user.id

    console.log("🔍 Starting payment verification")
    console.log("Payment ID:", razorpay_payment_id)
    console.log("Order ID:", razorpay_order_id)
    console.log("User ID:", userId)

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courses) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification data"
      })
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")

    console.log("🔐 Verifying signature...")
    console.log("Expected signature:", expectedSignature)
    console.log("Received signature:", razorpay_signature)

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature verification failed")
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature"
      })
    }

    console.log("✅ Signature verified successfully")

    // Enroll student in courses
    const enrollmentResult = await enrollStudentInCourses(courses, userId)
    
    if (!enrollmentResult.success) {
      return res.status(500).json({
        success: false,
        message: "Payment verified but enrollment failed",
        error: enrollmentResult.error
      })
    }

    console.log("🎓 Student enrolled successfully in all courses")

    return res.status(200).json({
      success: true,
      message: "Payment verified and student enrolled successfully",
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        enrolledCourses: enrollmentResult.enrolledCourses
      }
    })

  } catch (error) {
    console.error("❌ Error in verifyPayment:", error)
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    })
  }
}

// Send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body
    const userId = req.user.id

    console.log("📧 Sending payment success email")
    console.log("Order ID:", orderId)
    console.log("Payment ID:", paymentId)
    console.log("Amount:", amount)

    // Validate input
    if (!orderId || !paymentId || !amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for sending email"
      })
    }

    // Get user details
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Send email
    const emailResult = await mailSender(
      user.email,
      "Payment Successful - StudyNotion",
      paymentSuccessEmail(
        `${user.firstName} ${user.lastName}`,
        amount / 100, // Convert from paise to rupees
        orderId,
        paymentId
      )
    )

    console.log("✅ Payment success email sent successfully")

    return res.status(200).json({
      success: true,
      message: "Payment success email sent successfully"
    })

  } catch (error) {
    console.error("❌ Error sending payment success email:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to send payment success email",
      error: error.message
    })
  }
}

// Helper function to enroll student in courses
const enrollStudentInCourses = async (courses, userId) => {
  try {
    console.log("🎯 Starting course enrollment process")
    const enrolledCourses = []

    for (const courseId of courses) {
      try {
        console.log(`📖 Enrolling in course: ${courseId}`)

        // Find and update course
        const course = await Course.findByIdAndUpdate(
          courseId,
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )

        if (!course) {
          throw new Error(`Course ${courseId} not found`)
        }

        console.log(`✅ Added student to course: ${course.courseName}`)

        // Create course progress
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: []
        })

        console.log(`📊 Created progress tracking for course: ${courseId}`)

        // Update user's courses and course progress
        await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id
            }
          }
        )

        console.log(`👤 Updated user profile with course: ${courseId}`)

        // Send enrollment email
        const user = await User.findById(userId)
        if (user) {
          await mailSender(
            user.email,
            `Successfully Enrolled in ${course.courseName}`,
            courseEnrollmentEmail(
              course.courseName,
              `${user.firstName} ${user.lastName}`
            )
          )
          console.log(`📧 Sent enrollment email for: ${course.courseName}`)
        }

        enrolledCourses.push({
          courseId: course._id,
          courseName: course.courseName
        })

      } catch (courseError) {
        console.error(`❌ Error enrolling in course ${courseId}:`, courseError)
        throw courseError
      }
    }

    return {
      success: true,
      enrolledCourses: enrolledCourses
    }

  } catch (error) {
    console.error("❌ Error in enrollStudentInCourses:", error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get Razorpay key for frontend
exports.getRazorpayKey = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      key: key_id
    })
  } catch (error) {
    console.error("❌ Error getting Razorpay key:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to get Razorpay key"
    })
  }
}