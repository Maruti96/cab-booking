const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getDashboardStats,
} = require("../controllers/adminController");

// Admin Routes
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/dashboard", protect, isAdmin, getDashboardStats);

module.exports = router;