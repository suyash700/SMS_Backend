const mongoose = require("mongoose")

const receiptSchema = new mongoose.Schema({
     status: { type: String,  default: "paid" },
     user_id : {type:mongoose.Schema.Types.ObjectId , ref : "User"},
     maintainance_id : {type:mongoose.Schema.Types.ObjectId , ref : "Maintenance"},
},{timestamps:true})


const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
