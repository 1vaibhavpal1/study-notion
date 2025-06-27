# Razorpay Implementation Guide

## Overview
This document outlines the complete Razorpay integration implemented from scratch for the StudyNotion e-learning platform.

## Features Implemented
- ✅ Secure payment processing
- ✅ Real-time payment verification
- ✅ Automatic course enrollment
- ✅ Email notifications
- ✅ Error handling and logging
- ✅ Cart-based multi-course purchase
- ✅ Progress tracking setup

## Architecture

### Backend Components

#### 1. Configuration (`server/config/Razorpay.js`)
- Validates environment variables on startup
- Creates and tests Razorpay instance
- Exports reusable configuration

#### 2. Payment Controller (`server/controllers/Payment.js`)
- **capturePayment**: Creates Razorpay orders for course purchases
- **verifyPayment**: Verifies payment signatures and enrolls students
- **sendPaymentSuccessEmail**: Sends confirmation emails
- **getRazorpayKey**: Provides frontend with Razorpay key

#### 3. Routes (`server/routes/Payment.js`)
- Protected endpoints for payment operations
- Public endpoint for Razorpay key retrieval

### Frontend Components

#### 1. Student Features API (`src/services/operations/studentFeaturesAPI.js`)
- **buyCourse**: Main payment orchestration function
- **loadRazorpayScript**: Dynamic script loading
- **getRazorpayKey**: Fetches backend configuration
- **verifyPayment**: Frontend payment verification
- **sendPaymentSuccessEmail**: Success notification

#### 2. API Configuration (`src/services/apis.js`)
- All payment-related endpoints
- Proper URL structure

## Environment Variables Required

Create a `.env` file in the server directory with:

```env
# Razorpay Configuration
RAZORPAY_KEY=rzp_test_your_key_id
RAZORPAY_SECRET=your_secret_key

# Other required variables...
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

## Payment Flow

### 1. Initiate Payment
```javascript
// Frontend calls buyCourse function
buyCourse(token, courses, userDetails, navigate, dispatch)
```

### 2. Create Order
- Validates courses and user enrollment
- Calculates total amount
- Creates Razorpay order

### 3. Open Checkout
- Loads Razorpay script dynamically
- Opens payment modal with proper configuration
- Handles success/failure callbacks

### 4. Verify Payment
- Validates payment signature using HMAC-SHA256
- Enrolls student in purchased courses
- Creates progress tracking
- Sends confirmation emails

### 5. Complete Enrollment
- Updates course enrollment
- Creates CourseProgress documents
- Updates user profile
- Redirects to enrolled courses

## Error Handling

### Backend Errors
- Invalid course IDs
- Already enrolled students
- Unpublished courses
- Payment verification failures
- Database operation errors

### Frontend Errors
- Script loading failures
- Network issues
- Payment cancellations
- Verification failures

## Security Features

### 1. Payment Verification
- HMAC-SHA256 signature verification
- Server-side validation
- Razorpay webhook support

### 2. Authentication
- JWT token validation
- Role-based access (student only)
- Protected endpoints

### 3. Input Validation
- Course existence checks
- Enrollment status verification
- Amount validation

## Testing

### Manual Testing Steps
1. **Setup Environment**
   ```bash
   cd server
   # Ensure .env file has correct Razorpay credentials
   ```

2. **Test Backend**
   ```bash
   # Start server
   npm start
   
   # Test endpoints using Postman or curl
   ```

3. **Test Frontend**
   ```bash
   # Start frontend
   cd ../
   npm start
   
   # Navigate to course purchase flow
   ```

### Test Cases
- [ ] Single course purchase
- [ ] Multiple course purchase
- [ ] Already enrolled course handling
- [ ] Payment cancellation
- [ ] Network failure handling
- [ ] Invalid signature handling

## Monitoring & Logs

### Backend Logs
- Payment initiation: `🔄 Starting payment capture process`
- Order creation: `✅ Razorpay order created successfully`
- Payment verification: `🔍 Starting payment verification`
- Enrollment: `🎓 Student enrolled successfully`
- Errors: `❌ Error messages with context`

### Frontend Logs
- Payment process start: `🔄 Starting course purchase process`
- Script loading: `✅ Razorpay script loaded successfully`
- Payment success: `💰 Payment successful`
- Verification: `✅ Payment verified successfully`

## API Reference

### Backend Endpoints

#### GET /api/v1/payment/key
Get Razorpay public key for frontend

#### POST /api/v1/payment/capturePayment
Create payment order
```json
{
  "courses": ["courseId1", "courseId2"]
}
```

#### POST /api/v1/payment/verifyPayment
Verify payment and enroll student
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "courses": ["courseId1", "courseId2"]
}
```

#### POST /api/v1/payment/sendPaymentSuccessEmail
Send confirmation email
```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_xxx",
  "amount": 50000
}
```

## Troubleshooting

### Common Issues

1. **"Payment gateway failed to load"**
   - Check internet connection
   - Verify Razorpay script accessibility
   - Check for ad blockers

2. **"Invalid signature"**
   - Verify RAZORPAY_SECRET in environment
   - Check signature generation logic
   - Ensure order ID and payment ID are correct

3. **"Course not found"**
   - Verify course exists in database
   - Check course status (must be Published)
   - Validate course ID format

4. **"Already enrolled"**
   - Check student enrollment status
   - Clear any test enrollments
   - Verify user authentication

## Production Checklist

- [ ] Replace test Razorpay keys with live keys
- [ ] Configure webhooks for payment status updates
- [ ] Set up monitoring and alerting
- [ ] Implement payment reconciliation
- [ ] Add GST/tax calculations if required
- [ ] Set up backup payment methods
- [ ] Configure rate limiting
- [ ] Add payment analytics
- [ ] Test with real bank accounts
- [ ] Verify PCI compliance requirements

## Support

For issues related to:
- **Razorpay Integration**: Check Razorpay documentation
- **Payment Flow**: Review this implementation guide
- **Course Enrollment**: Check database models and relationships
- **Email Notifications**: Verify mail configuration

---

**Note**: This implementation uses Razorpay Test Mode. Switch to Live Mode only after thorough testing and completing all production requirements. 