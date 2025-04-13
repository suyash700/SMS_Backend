const Maintenance = require("../models/maintainance.model");

const self_maintainance_fine = async (req, res, next) => {
    try {
        const today = new Date(); 
        const fineData = req.userMaintainData;

        let fineAmount = fineData.fine_amount; // Previous fine
        let originalAmount = fineData.amount;  // Base maintenance fee
        let totalAmount = fineData.total_amount || originalAmount; // Ensure total is set
        const dueDate = new Date(fineData.due_date);

        console.log("Today's Date:", today);
        console.log("Due Date:", dueDate);
        console.log("Comparison (Today > Due Date):", today > dueDate);

        // ✅ If payment is still pending after the due date, impose fine
        if (today > dueDate && fineData.status === "pending") {
            const newFine = totalAmount * 0.10; // 10% fine on the total amount
            fineAmount += newFine;
            totalAmount += newFine; // Add fine to total

            console.log("New Fine Applied:", newFine);
            console.log("Updated Fine Amount:", fineAmount);
            console.log("Updated Total Amount:", totalAmount);

            // Extend due date by 1 month
            const newDueDate = new Date(dueDate);
            newDueDate.setMonth(newDueDate.getMonth() + 1);

            console.log("New Due Date:", newDueDate);

            // ✅ Update `fine_amount`, `total_amount`, and `due_date`
            let updatedMaintenance = await Maintenance.findOneAndUpdate(
                { user_id: req.userID },
                { 
                    $set: { 
                        fine_amount: fineAmount, 
                        total_amount: totalAmount, 
                        due_date: newDueDate
                    } 
                },
                { new: true }
            );

            if (!updatedMaintenance) {
                return res.status(404).json({ message: "User not found" });
            }

            console.log("Final Updated Fine:", updatedMaintenance.fine_amount);
            console.log("Final Total Amount:", updatedMaintenance.total_amount);
        }

        next(); // Move to the next middleware

    } catch (error) {
        console.error(`Error from fine maintenance middleware: ${error}`);
        next(error);
    }
};

module.exports = self_maintainance_fine;
