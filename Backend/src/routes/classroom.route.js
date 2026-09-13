const { Router } = require("express");
const {
  createClassroom,
  getAllClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  getPublicClassrooms,
} = require("../controllers/classroom.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createClassroom);
router.get("/public", getPublicClassrooms);
router.get("/", authMiddleware, getAllClassroom);
router.get("/:id", authMiddleware, getClassroomById);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateClassroom);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteClassroom);

module.exports = router;
