import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    GET_RAZORPAY_KEY_API
} = studentEndpoints;

// Get Razorpay key from backend
const getRazorpayKey = async () => {
    try {
        const response = await apiConnector("GET", GET_RAZORPAY_KEY_API);
        if (response.data.success) {
            return response.data.key;
        }
        throw new Error("Failed to get Razorpay key");
    } catch (error) {
        console.error("❌ Error getting Razorpay key:", error);
        toast.error("Failed to load payment gateway");
        throw error;
    }
};

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        
        script.onload = () => {
            console.log("✅ Razorpay script loaded successfully");
            resolve(true);
        };
        
        script.onerror = () => {
            console.error("❌ Failed to load Razorpay script");
            resolve(false);
        };
        
        document.body.appendChild(script);
    });
};

// Main function to buy course
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Initializing payment...");
    
    try {
        console.log("🔄 Starting course purchase process");
        console.log("Courses to buy:", courses);
        console.log("User details:", userDetails);

        // Validate inputs
        if (!token) {
            throw new Error("Authentication token is required");
        }
        
        if (!courses || courses.length === 0) {
            throw new Error("No courses selected for purchase");
        }

        // Load Razorpay script
        toast.loading("Loading payment gateway...", { id: toastId });
        const scriptLoaded = await loadRazorpayScript();
        
        if (!scriptLoaded) {
            throw new Error("Payment gateway failed to load. Please try again.");
        }

        console.log("🔑 Getting Razorpay key...");
        const razorpayKey = await getRazorpayKey();

        // Create payment order
        toast.loading("Creating payment order...", { id: toastId });
        console.log("💳 Creating payment order...");
        
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message || "Failed to create payment order");
        }

        console.log("✅ Payment order created:", orderResponse.data.data);

        const { orderId, amount, currency, courses: courseDetails } = orderResponse.data.data;

        // Configure Razorpay options
        const razorpayOptions = {
            key: razorpayKey,
            amount: amount,
            currency: currency,
            order_id: orderId,
            name: "StudyNotion",
            description: `Purchase ${courseDetails.length} course(s)`,
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,
                contact: userDetails.contactNumber || ""
            },
            theme: {
                color: "#FFD60A"
            },
            handler: function (response) {
                console.log("💰 Payment successful:", response);
                toast.dismiss(toastId);
                
                // Send success email
                sendPaymentSuccessEmail(
                    response,
                    amount,
                    token
                );
                
                // Verify payment
                verifyPayment(
                    { ...response, courses },
                    token,
                    navigate,
                    dispatch
                );
            },
            modal: {
                ondismiss: function () {
                    console.log("❌ Payment cancelled by user");
                    toast.error("Payment cancelled", { id: toastId });
                    dispatch(setPaymentLoading(false));
                }
            },
            retry: {
                enabled: true,
                max_count: 3
            },
            timeout: 300, // 5 minutes
            remember_customer: true
        };

        console.log("🚀 Opening Razorpay checkout...");
        toast.loading("Opening payment gateway...", { id: toastId });

        // Open Razorpay checkout
        const razorpay = new window.Razorpay(razorpayOptions);
        
        razorpay.on('payment.failed', function (response) {
            console.error("❌ Payment failed:", response.error);
            toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`, { id: toastId });
            dispatch(setPaymentLoading(false));
        });

        razorpay.open();
        dispatch(setPaymentLoading(true));

    } catch (error) {
        console.error("❌ Error in buyCourse:", error);
        toast.error(error.message || "Could not initiate payment", { id: toastId });
        dispatch(setPaymentLoading(false));
    }
}

// Send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        console.log("📧 Sending payment success email...");
        
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: amount,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        
        console.log("✅ Payment success email sent");
    } catch (error) {
        console.error("❌ Error sending payment success email:", error);
        // Don't throw error as this is not critical for the payment flow
    }
}

// Verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment...");
    dispatch(setPaymentLoading(true));
    
    try {
        console.log("🔍 Verifying payment...");
        console.log("Payment data:", bodyData);
        
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Payment verification failed");
        }

        console.log("✅ Payment verified successfully");
        console.log("Enrolled courses:", response.data.data.enrolledCourses);

        toast.success(
            `Payment successful! You have been enrolled in ${response.data.data.enrolledCourses.length} course(s)`,
            { id: toastId }
        );

        // Clear cart and navigate
        dispatch(resetCart());
        navigate("/dashboard/enrolled-courses");

    } catch (error) {
        console.error("❌ Payment verification failed:", error);
        toast.error(error.message || "Could not verify payment", { id: toastId });
    } finally {
        dispatch(setPaymentLoading(false));
    }
}

// Alternative function for single course purchase (for backward compatibility)
export async function buySingleCourse(token, courseId, userDetails, navigate, dispatch) {
    return buyCourse(token, [courseId], userDetails, navigate, dispatch);
}