const express= require('express');
const router=express.Router()
const admin=require("../controllers/admin-controller")
const authMiddleware= require("../middlewares/auth-middleware");
const adminMiddleware = require('../middlewares/admin-middleware');
const authcontrollers=require("../controllers/auth-controller")
const validate=require("../middlewares/validate-middleware")
// const admincontrollers=require("../controllers/admin-controller")
const loginSchema=require('../validators/auth-login-validator')
// router.route("/users").get(authMiddleware,admin.getAllUsers);
// const maintainance = require('../controllers/maintainance-controller')

router.route("/login").post(validate(loginSchema), admin.login);

router.route("/users").get(authMiddleware,adminMiddleware,admin.getAllUsers);

router.route("/users/delete/:id").delete(authMiddleware,adminMiddleware,admin.deleteUserById);

router.route("/users/:id").get(authMiddleware,adminMiddleware,admin.getUserbyId);

router.route("/users/update/:id").patch(authMiddleware,adminMiddleware,validate(loginSchema),admin.updateUserbyId);

router.route("/contacts").get(authMiddleware,adminMiddleware,admin.contactsAllUsers);

router.route("/maintainances").get(authMiddleware,adminMiddleware,admin.getAllMaintainance);

router.route("/singlemaintainance/:id").get(authMiddleware,adminMiddleware,admin.getMaintainancebyId);

router.route("/singlemaintainance/update/:id").patch(authMiddleware,adminMiddleware,admin.updateMaintainancebyId);




module.exports= router;