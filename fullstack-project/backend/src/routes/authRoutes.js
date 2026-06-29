const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, authController.getMe);

router.get("/register", (req, res) => {
  res.json({
    success: true,
    message: "Register Route Working"
  });
});

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;