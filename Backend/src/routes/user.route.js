const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getCurrentUser } = require("../controllers/user.controller");

const router = Router();

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
