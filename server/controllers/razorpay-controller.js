const createRazorpayInstance = require("../utils/razorpay.utils");
const crypto = require("crypto");
const Payment = require("../models/payment.model")
const razorpayInstance = createRazorpayInstance();

// 🛒 Create Order (Fix: Extract `amount` from `req.body`)
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // ✅ Extract amount from request
        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.error("Error creating order:", err);
                return res.status(500).json({ success: false, message: "Error creating order" });
            }
            order.amount=amount;
            order.amount_due=amount;

          

            return res.status(200).json({ success: true, order });
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: false, message: "Server error in order creation" });
    }
};

// ✅ Verify Payment (Fix: Correct HMAC & secret variable)
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // ✅ Create HMAC with SHA256 using Razorpay Secret
        const hmac = crypto.createHmac("sha256", RAZORPAY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === razorpay_signature) {
            // 👉 Store payment details in the database (MongoDB example)
            const payment = new Payment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                status: "Success",
                amount: req.body.amount, // Store amount (optional)
                date: new Date()
            });

            await payment.save();
            //const userData = req.user;
            //const paymentStatus = req.
            // res.status(201).json({ 
            //     msg: "User registered successfully", 
            //     // user: Createduser ,
            //     token:await Createduser.generateToken(),
            //     userId:Createduser._id.toString() ,
            //     userMaintainanceId : Createduser.maintainanceId.toString(),
            //     maintenanceId: newMaintenance._id.toString()
            // });
            const verify =   await payment.verifiedPayment();
            res.send(verify)

            return res.status(200).json({ success: true, message: "Payment verified",STATUS : await payment.verifiedPayment()});
        } else {
            return res.status(400).json({ success: false, message: "Payment NOT verified" });
        }

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

const testVerifiedPayment = async (req, res) => {
    try {
        // ✅ Mock user ID for testing (Replace with real user ID if needed)
        const testUserID = "user_123456"; 

        // ✅ Manually create a Payment instance (simulating a payment)
        const mockPayment = new Payment({
            orderId: "test_order_001",
            paymentId: "test_payment_001",
            status: "Success",
            amount: 1000, // 10 INR (amount is in paise)
            date: new Date()
        });

        // ✅ Call `verifiedPayment` to update status in Maintenance DB
        const updatedUserData = await mockPayment.verifiedPayment(testUserID);

        // ✅ Return mock output
        return res.status(200).json({
            success: true,
            message: "Test payment verified",
            userData: updatedUserData
        });

    } catch (error) {
        console.error("Test Payment Verification Error:", error);
        return res.status(500).json({ success: false, message: "Error verifying test payment" });
    }
};






module.exports = { createOrder, verifyPayment ,testVerifiedPayment};


// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema({
//     orderId: { type: String, required: true },
//     paymentId: { type: String, required: true },
//     status: { type: String, required: true },
//     amount: { type: Number, required: true },
//     date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Payment", PaymentSchema);

// Payment this is the instance of PaymentSchema i want to write a function
// after my controller has run succressfully means suppose if condition has executed i want to run a method
// which is