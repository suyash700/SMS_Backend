const z = require('zod');

const contactzodSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email format" }),

         name: z
                .string({ required_error: "Name is required" })
                .trim()
                .min(1, "Name is required"), // Prevent empty string
        

    message: z
        .string({ required_error: "Message caanot be empty" })
        .trim()
        .min(1, { message: "Message must be at least 1 characters" })
        .max(100, { message: "Message must not be more than 100 characters" })
});

module.exports = contactzodSchema;
