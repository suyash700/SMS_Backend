const mongoose = require("mongoose");
const Maintenance = require('../models/maintainance.model')
const PaymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});


// 🔍 Fix: Pass req as an Argument
// Since req.userMaintainData is needed, pass it as an argument to verifiedPayment().

// 🔹 Fix in verifiedPayment() Method
PaymentSchema.methods.verifiedPayment = async function (req, res) {
    try {
        console.log(req.userMaintainData);

        // ✅ Fix: Await the update operation
        let userData = await Maintenance.findOneAndUpdate(
            { user_id: req.userMaintainID }, // Query
            { $set: { status: "paid" } },   // Update
            { new: true, runValidators: true } // Options: Return updated doc
        );

        if (!userData) {
            throw new Error("User not found"); // ❌ Don't return `res.json` inside model
        }

        return userData; // ✅ Return updated data
    } catch (error) {
        console.error("Update failed:", error);
        return res.status(500).json({ message: "verifiedPayment failed!" });
    }
};






module.exports = mongoose.model("Payment", PaymentSchema);
