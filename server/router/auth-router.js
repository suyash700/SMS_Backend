const express= require('express');
const router=express.Router()
const authcontrollers=require("../controllers/auth-controller")
const signupSchema=require('../validators/auth-validator')
const loginSchema=require('../validators/auth-login-validator')
const validate=require("../middlewares/validate-middleware")
const authMiddleware = require('../middlewares/auth-middleware');
const self_maintain_middleware = require('../middlewares/user-maintain-middleware');
const maintainance_controller = require("../controllers/maintainance-controller")
const fine_middleware = require('../middlewares/fine-middleware');
const payment_controller = require("../controllers/payment-controller")
const razorpay_controller = require("../controllers/razorpay-controller")
// router.get("/",function(req,res){
//    res.status(200).send("hellooooo");
// })

router.route("/").get(authcontrollers.home);

router.route("/register").post( validate(signupSchema), authcontrollers.register);

router.route("/login").post(validate(loginSchema), authcontrollers.login);

router.route("/user").get( authMiddleware, authcontrollers.user);

router.route("/user/maintainance").get( authMiddleware,self_maintain_middleware, maintainance_controller.self_maintainance);

//router.route("/user/maintainance/fine").get( authMiddleware,self_maintain_middleware, maintainance_controller.self_maintainance_fine);

router.route("/user/maintainance/payment").get( authMiddleware,self_maintain_middleware,fine_middleware,payment_controller.payment_maintainance );
//router.route("/logout").get(authcontrollers.logout);

// router.route("/user/maintainance/amountpay").post(payment_controller.pay_amount)
router.route("/maintainances").get(authMiddleware,authcontrollers.getAllMaintainance);

router.route("/user/createorder").post(authMiddleware,razorpay_controller.createOrder)

router.route("/user/verifypayment").post(authMiddleware,razorpay_controller.verifyPayment)

router.route("/user/testpayment").post(authMiddleware,razorpay_controller.testVerifiedPayment)

router.route("/user/event").get( authMiddleware, authcontrollers.event);


module.exports= router;