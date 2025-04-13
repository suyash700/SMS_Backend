require("dotenv").config();

const express= require('express');
const app=express();
const cors = require('cors')
const authRoute=require("./router/auth-router")
const contactRoute=require("./router/contact-router")
const adminRoute=require("./router//admin-router")

const connectDB =require("./utils/db");
const errorMiddleware = require('./middlewares/error-middleware');

// const paypal = require('@paypal/checkout-server-sdk');





//data milne se pehle cors apply
const corsOptions = {
   origin: 'https://society-management-tqy4.vercel.app/',
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials:true,
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
 }

//  http://localhost:5173
app.use(cors(corsOptions))
//notes : 1
app.use(express.json());



// paypal.configure(
//    {
//       "mode":"sandbox",
//       "client_id":process.env.PAYPAL_API_KEY,
//       "client_secret":process.env.PAYPAL_SECRET,
//    }
// )

//notes : 1
app.use("/api/auth",authRoute)
app.use("/api/form",contactRoute)

app.use("/api/admin",adminRoute)
// app.use("/api/payment",paymentRoute)
app.use(errorMiddleware)

const PORT=4000 

connectDB()
    .then(() => 
 {          
    app.listen(PORT,function(){
    console.log(`server started at port : ${PORT}`);  
    })
 })
 
