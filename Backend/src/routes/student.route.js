const { Router } = require("express");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

const router = Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createStudent);
router.get("/", authMiddleware, getAllStudents);
router.get("/:id", authMiddleware, getStudentById);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateStudent);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteStudent);

module.exports = router;
