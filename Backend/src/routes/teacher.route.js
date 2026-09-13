const { Router } = require("express");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  selfRegisterTeacher,
} = require("../controllers/teacher.controller");

const router = Router();

router.post("/self-register", selfRegisterTeacher);
router.post("/", authMiddleware, authorizeRoles("admin"), createTeacher);
router.get("/", authMiddleware, getAllTeachers);
router.get("/:id", authMiddleware, getTeacherById);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateTeacher);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteTeacher);

module.exports = router;
