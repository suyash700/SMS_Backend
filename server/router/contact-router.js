const express= require('express');
const { contactForm } = require('../controllers/contact-controller');
const contactzodSchema = require('../validators/auth-contact-validator');
const router=express.Router();
const validate=require("../middlewares/validate-middleware")


router.route("/contact").post(validate(contactzodSchema) , contactForm);
module.exports=router;