const { z } = require("zod");

const classroomSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .max(20, "Class name is too long"),
  section: z.string().min(1, "Section is required"),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
});

module.exports = classroomSchema;
