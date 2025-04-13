const mongoose = require("mongoose");

const monthSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Ensure unique month names
});

module.exports = mongoose.model("Month", monthSchema);
