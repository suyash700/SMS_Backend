const mongoose=require('mongoose')
const bcrypt =require('bcryptjs')
const jwt=require("jsonwebtoken")
// const userSchema=mongoose.Schema({
//     userName:String,
//     userEmail:String,
//     userPassword:String,
    
//     // Status:{
//     //     type:mongoose.Schema.Types.ObjectId,
//     //     ref:"usermaintainance"
//     // },
//     // PaymentHistory:[
//     //     {
//     //         type:mongoose.Schema.Types.ObjectId,
//     //         ref:"usermaintainance"
//     //     }
//     // ]
// })


// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     password: { type: String, required: true }
// });


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    phone: { type: String, required: true },
    // flat_no: { type: String },
    maintainanceId : {type:String , default:""} ,
    isAdmin:{type:Boolean,default:false}
    
    // created_at: { type: Date, default: Date.now }
});



//secure password with brcypt
userSchema.pre("save",async function (next) {
    const user = this;
    if(!user.isModified("password")){
        next();
    }

    try {
        const saltRound =await bcrypt.genSalt(10)
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password=hash_password;

    } catch (error) {
        next(error)
    }
})

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                name: this.name,
            },
            process.env.JWT_KEY,
            { expiresIn: "30d" }
        );
    } catch (error) {
        console.error(error);
        throw new Error("Token generation failed");
    }
};
const User = mongoose.model("User", userSchema);
module.exports = User;


