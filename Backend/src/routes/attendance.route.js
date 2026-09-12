const { Router } = require("express");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
} = require("../controllers/attendance.controller");

const router = Router();

router.post(
  "/mark",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  markAttendance,
);
router.get("/", authMiddleware, getClassAttendance);
router.get("/student/:studentId", authMiddleware, getStudentAttendance);

module.exports = router;
