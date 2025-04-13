const Contact=require('../models/contact.model')

const contactForm= async (req,res) => {
    try {
        const {email,name,message}=req.body;
        const userExists=await Contact.findOne({email})

        if(userExists){
           await Contact.findOneAndUpdate({message:message})
            return res.status(200).json({ msg: "Message sent and updated successfully" });
        }

        await Contact.create({ email, name, message });

        // Contact.
        return res.status(200).json({ msg: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ msg: "Message not sent " });
        
    }
};

module.exports={contactForm}