const z = require('zod');

const maintenanceUpdateSchema = z.object({
    total_amount: z.string(),
    status: z.enum(["paid", "pending", "overdue"]),
    lastPaid: z.string().optional(),
  });

  module.exports = maintenanceUpdateSchema;