const { z } = require("zod");

const createTeacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  employeeId: z.string().min(1, "Employee ID is required"),
  subjects: z.array(z.string()).optional(),
  qualification: z.string().optional(),
  phone: z.string().optional(),
});

module.exports = { createTeacherSchema };
