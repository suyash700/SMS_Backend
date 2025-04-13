const Maintenance = require("../models/maintainance.model");
const paypal = require("@paypal/checkout-server-sdk");

const express= require('express');
const router=express.Router()

const payment_maintainance = async (req, res) => {
    try {
        // ✅ Fetch the latest updated data from DB
        const payData = await Maintenance.findOne({ user_id: req.userID });

        if (!payData) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updated Pay Data:", payData);
        return res.status(200).json({
            total_amount: payData.total_amount,
            fine_amount: payData.fine_amount,
            due_date: payData.due_date,
            status: payData.status
        });

    } catch (error) {
        console.error(`Error from payment controller: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const pay_amount = async (req,res) => {
    const environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_API_KEY,  
        process.env.PAYPAL_SECRET,  
      );
      const client = new paypal.core.PayPalHttpClient(environment);
      
      // 🛒 **Route to Create an Order**
      router.post("/create-order", async (req, res) => {
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "10.00", // Change the amount as needed
              },
            },
          ],
        });
      
        try {
          const order = await client.execute(request);
          const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
          res.json({ approvalUrl }); // Send PayPal redirect URL to the frontend
        } catch (error) {
          console.error("Order Creation Error:", error);
          res.status(500).json({ error: "Something went wrong" });
        }
      });
      
      // ✅ **Route to Capture Payment & Redirect**
      router.get("/success", async (req, res) => {
        const { token } = req.query; // PayPal order ID
        const request = new paypal.orders.OrdersCaptureRequest(token);
        request.requestBody({});
      
        try {
          const capture = await client.execute(request);
          console.log("Payment Success:", capture.result);
          res.redirect("http://localhost:4000/success"); // Redirect user to success page
        } catch (error) {
          console.error("Capture Error:", error);
          res.redirect("http://localhost:4000/cancel"); // Redirect user if payment fails
        }
      });
      
}



module.exports = { payment_maintainance , pay_amount ,router};


//email notifications or nomrmal push
//event
//