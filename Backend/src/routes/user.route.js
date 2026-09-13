const { Router } = require("express");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  getCurrentUser,
  getPendingUsers,
  approveUser,
} = require("../controllers/user.controller");

const router = Router();

router.get("/me", authMiddleware, getCurrentUser);
router.get(
  "/pending",
  authMiddleware,
  authorizeRoles("admin"),
  getPendingUsers,
);
router.put(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("admin"),
  approveUser,
);

module.exports = router;
