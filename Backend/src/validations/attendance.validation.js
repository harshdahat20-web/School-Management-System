const { z } = require("zod");

const markAttendanceSchema = z.object({
  classRoom: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  records: z
    .array(
      z.object({
        student: z.string().min(1, "Student id is required"),
        status: z.enum(["present", "absent", "late", "leave"]),
      }),
    )
    .min(1, "At least one attendance record is required"),
});

module.exports = { markAttendanceSchema };
