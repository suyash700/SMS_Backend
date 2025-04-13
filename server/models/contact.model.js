const mongoose=require('mongoose')


const contactSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    message: { type: String, required: true }
});


const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;