const User = require("../models/user.model")
const Contact = require("../models/contact.model");
const Maintenance = require('../models/maintainance.model')
const mongoose = require("mongoose");
const bcrypt =require('bcryptjs')
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const checkuser = await User.findOne({ email });

        if (!checkuser) {
            return res.status(401).json({ message: "Invalid Credentials from admin" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, checkuser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        console.log("admin",checkuser);
        

        // If credentials are correct, return token
        let isAdmin = checkuser.isAdmin
        if(isAdmin){
            res.status(200).json({ 
                msg: "User login successfully", 
                token: await checkuser.generateToken(),
                userId: checkuser._id.toString(),
                isAdmin: checkuser.isAdmin.toString()
            });
        }else{
            res.status(401).json({ 
                msg: "User is not an Admin", 
                token: await checkuser.generateToken(),
                userId: checkuser._id.toString(),
                isAdmin: checkuser.isAdmin.toString()
            });
        }
       

    } catch (error) {
        next(error);  // Pass error to middleware
    }
};

const getAllUsers = async(req,res,next) =>
{
    try {
        const users=await User.find({},{password:0});
        console.log(users);
        
        if(!users || users.length===0){
            return res.status(404).json({message:"No users"})
        }else{
            return res.status(200).json(users)
        }
    } catch (error) {
        next(error);
    }
}


const contactsAllUsers = async(req,res,next) =>
{
    try {
        const contacts=await Contact.find();
        console.log(contacts);
        
        if(!contacts || contacts.length===0){
            return res.status(404).json({message:"No contactsus"})
        }else{
            return res.status(200).json(contacts)
        }
    } catch (error) {
        next(error);
    }
}

const deleteUserById = async (req,res,next) => {
 try {

    const id =req.params.id;
    await User.deleteOne({_id:id})
    return  res.status(200).json({message:"User deleted Successfully"})
 } catch (error) {
    next(error)
 }
}

const getUserbyId = async (req,res,next) => {
    try {
        const id= req.params.id;
        const user=await User.findById({_id:id},{password:0});
        console.log(user);
        
        if(!user){
            return res.status(404).json({message:"No user"})
        }else{
            return res.status(200).json(user)
        }
    } catch (error) {
        next(error)
    }
}

const updateUserbyId = async (req,res,next) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;
        
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Prevent updating with an empty body
        if (Object.keys(updateUserData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const existingData = await User.findOne({ _id: id });
        if (!existingData) {
            return res.status(404).json({ message: "No record found with this ID" });
        }

        const updateData = await User.findByIdAndUpdate(
            id,
            { $set: updateUserData },
            { new: true},
            { writeConcern: { w: 1 } } 
        );

        if (updateData.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes made to the document" });
        }

        
       console.log(updateData);
       
        
        return res.status(200).json({ message: "Update successful", data: updateData });
    } catch (error) {
        next(error);
    }
}

const getAllMaintainance = async(req,res,next) =>
    {
        try {
            const maintainances=await Maintenance.find({},{password:0});
            console.log(maintainances);
            
            if(!maintainances || maintainances.length===0){
                return res.status(404).json({message:"No maintainances"})
            }else{
                return res.status(200).json(maintainances)
            }
        } catch (error) {
            next(error);
        }
    }

    const getMaintainancebyId = async (req,res,next) => {
        try {
            const id= req.params.id;
            const user=await Maintenance.findById({_id:id});
            console.log(user);
            
            if(!user){
                return res.status(404).json({message:"No maintainance data"})
            }else{
                return res.status(200).json(user)
            }
        } catch (error) {
            next(error)
        }
    }

    
const updateMaintainancebyId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateUserMaintainance = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Prevent updating with an empty body
        if (!Object.keys(updateUserMaintainance).length) {
            return res.status(400).json({ message: "No update data provided" });
        }

        // Check if record exists before updating
        const existingData = await Maintenance.findById(id);
        if (!existingData) {
            return res.status(404).json({ message: "No record found with this ID" });
        }

        // Perform the update
        const updateData = await Maintenance.findByIdAndUpdate(
            id,
            { $set: updateUserMaintainance },
            { new: true, runValidators: true } // Return updated document and validate changes
        );

        if (!updateData) {
            return res.status(400).json({ message: "No changes made to the document" });
        }

        return res.status(200).json({ message: "Update successful", data: updateData });

    } catch (error) {
        console.error("Error updating maintenance:", error);
        next(error);
    }
};

module.exports = updateMaintainancebyId;
     
    
module.exports={login,getAllUsers,contactsAllUsers,deleteUserById,getUserbyId,updateUserbyId,getAllMaintainance,getMaintainancebyId,updateMaintainancebyId};