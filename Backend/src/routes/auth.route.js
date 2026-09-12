const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const { Router } = require("express");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
