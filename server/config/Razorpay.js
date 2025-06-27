const Razorpay = require('razorpay');

// Validate environment variables
if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    console.error('Missing Razorpay environment variables');
    console.error('Required: RAZORPAY_KEY and RAZORPAY_SECRET');
    process.exit(1);
}

// Create Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Test the connection
razorpayInstance.orders.all({ count: 1 })
    .then(() => {
        console.log('✅ Razorpay connected successfully');
    })
    .catch((error) => {
        console.error('❌ Razorpay connection failed:', error.message);
    });

module.exports = {
    instance: razorpayInstance,
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
};