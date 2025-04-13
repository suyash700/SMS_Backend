const User = require("../models/user.model")
const bcrypt =require('bcryptjs')
const jwt=require("jsonwebtoken")
const Maintenance = require('../models/maintainance.model');
const Month = require('../models/month.model');
const Event = require("../models/events.model");


const home= async (req,res) => {
    try {
        res
            .status(200)
            .send("hello")
    } catch (error) {
        console.log(error);
        
    }
};


const register = async (req, res,next) => {
    try {
        console.log(req.body); // Debugging: Log request body

        const { email, name, password,isAdmin,phone } = req.body;
        console.log(req.body);
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password before saving
         //check usermodel and notes

        // Create a new user
        let Createduser = await User.create({
            email,
            name,
            password,
            isAdmin,phone, // Save hashed password
        });
        let transaction_history;
        let fine_amount;
        let month;
        console.log("Created User:", Createduser); // Debugging

          // **Get Current Month Name**
          const currentMonthName = new Date().toLocaleString("default", { month: "long" });

          // **Find or Create the Month in the Month Collection**
          let monthRecord = await Month.findOne({ name: currentMonthName });
  
          if (!monthRecord) {
              monthRecord = await Month.create({ name: currentMonthName });
          }

        const newMaintenance = await Maintenance.create({
            user_id: Createduser._id,
            username:Createduser.name,
            amountDue: 0, // Default maintenance amount (change as needed)
            status: "pending",
            transaction_history,fine_amount,
            month: monthRecord._id, // 🔥 Linking Month ID
        });
        console.log("Maintenance record created:", newMaintenance);

        Createduser=  await User.findByIdAndUpdate(Createduser._id, {
            maintainanceId: newMaintenance._id
        }, { new: true });
        
        console.log("New user created ",Createduser);
        
        res.status(201).json({ 
            msg: "User registered successfully", 
            // user: Createduser ,
            token:await Createduser.generateToken(),
            userId:Createduser._id.toString() ,
            userMaintainanceId : Createduser.maintainanceId.toString(),
            maintenanceId: newMaintenance._id.toString()
        });
        res.redirect("/api/auth/login")

    } catch (error) {
      next(error)
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const checkuser = await User.findOne({ email });

        if (!checkuser) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, checkuser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // If credentials are correct, return token
        
        res.status(200).json({ 
            msg: "User login successfully", 
            token: await checkuser.generateToken(),
            userId: checkuser._id.toString(),
            isAdmin: checkuser.isAdmin.toString()
        });
       

    } catch (error) {
        next(error);  // Pass error to middleware
    }
};


//user logic to send user data


// const user = async (req,res) => {
//         try {
//             const userData = req.user
//             console.log(userData);

//          return   res.status(200).json({userData})
            
//         } catch (error) {
//             console.log(`error from the user route ${error}`);
            
//         }
// }

const user = async (req, res) => {
    try {
      // const userData = await User.find({});
      const userData = req.user;
      console.log(userData);
      return res.status(200).json( userData );
    } catch (error) {
      console.log(` error from user route ${error}`);
    }
  };


  const event = async (req, res) => {
    try {
      const eventData = await  Event.find({});
    //   const eventData = req.user;
      console.log(eventData);
      return res.status(200).json( eventData );
    } catch (error) {
      console.log(` error from event route ${error}`);
    }
  };
// const self_maintainance = async (req, res) => {
//     try {
//       // const userData = await User.find({});
//       const maintainData = req.userMaintainData;
//       console.log(maintainData);
//       return res.status(200).json({ msg: maintainData });
//     } catch (error) {
//       console.log(` error from user route ${error}`);
//     }
//   };

const getAllMaintainance = async (req, res, next) => {
    try {
        let { month } = req.query;
        console.log("Received Month:", month);

        // Find corresponding month document
        const monthDoc = await Month.findOne({ name: month });
        if (!monthDoc) {
            return res.status(404).json({ message: "Invalid month" });
        }

        // Query maintenance records for the given month ID
        const maintainances = await Maintenance.find(
            { month: monthDoc._id },
            { password: 0 }
        );

        console.log("Filtered Maintenance Records:", maintainances);

        if (!maintainances || maintainances.length === 0) {
            return res.status(404).json({ message: "No maintainances found" });
        }

        return res.status(200).json(maintainances);
    } catch (error) {
        next(error);
    }
};





module.exports={home,register,login,user,event,getAllMaintainance};