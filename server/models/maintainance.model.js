const mongoose = require("mongoose");

const today = new Date(); // Get today's date
const dueDate = new Date(today); // Create a copy of today's date

// dueDate.setMonth(dueDate.getMonth() + 1); // Add 1 month

const maintenanceSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    // username:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    amount: { type: Number, default:0 },
    due_date: { type: Date, default:dueDate.setMonth(dueDate.getMonth() + 1)},
    trasaction_history : {type:[],default:[]},
    fine_amount : {type:Number,default:0},
    total_amount:{type:Number,default:0},
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    month :{type:Array,default:[ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]}
},{minimize:false});




const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = Maintenance;
