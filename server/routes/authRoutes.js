const express = require("express");
const router = express.Router();

// Import Controllers
const { registerUser, loginUser } = require("../controllers/authController");

// Import Middleware (FIXED)
const { protect } = require("../middleware/authMiddleware");


// =====================================
// REGISTER ROUTE
// =====================================
router.post("/register", registerUser);


// =====================================
// LOGIN ROUTE
// =====================================
router.post("/login", loginUser);


// =====================================
// PROTECTED PROFILE ROUTE
// =====================================
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    userId: req.user.id,
  });
});


module.exports = router;
