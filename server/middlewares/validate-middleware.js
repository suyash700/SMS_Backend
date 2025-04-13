const validate = (schema) => async (req, res, next) => {
    try {       
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody; // Assign parsed body to request
        next();
    } catch (err) {
        const status =422;
        const message ="Please enter details properly";
        const extraDetails= err.errors.map(e => e.message); // Collect all error messages
        console.log("Validation Error:", err.errors); // Log full errors for debugging

        const error ={
            status,
            message,
            extraDetails
        };
        
        next(error);
     //   return res.status(400).json({ errors: messages }); // Return all validation errors
    }
};

module.exports = validate;
