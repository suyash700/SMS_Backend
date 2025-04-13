const z = require('zod');

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email format" }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(6, { message: "Invalid email or password" })
        .max(10, { message: "Password must not be more than 10 characters" })
});

module.exports = loginSchema;
