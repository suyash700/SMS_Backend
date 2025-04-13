const z = require('zod');

const signupSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, "Name is required"), // Prevent empty string

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email format" }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(10, { message: "Password must not be more than 10 characters" }),

    phone: z
        .string({ required_error: "phone is required" })
        .trim()
        .min(10,"Give valid Phone num")
        .max(10,"Give valid Phone num"),
    // isAdmin: z
    //     .boolean({ msg:"role is required" })
        
        


});

module.exports = signupSchema;
