const express = require("express");
const router = express.Router();

const {
  createRide,
  acceptRide,
  completeRide,
  cancelRide,
  getAllRides,
  getSingleRide,
  rateRide,
  payForRide,
  getDriverEarnings,   // ✅ Added earnings
} = require("../controllers/rideController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// USER BOOK RIDE
// ===============================
router.post("/create", protect, createRide);

// ===============================
// DRIVER ACCEPT RIDE
// ===============================
router.put("/accept/:id", protect, acceptRide);

// ===============================
// DRIVER COMPLETE RIDE
// ===============================
router.put("/complete/:id", protect, completeRide);

// ===============================
// USER CANCEL RIDE
// ===============================
router.put("/cancel/:id", protect, cancelRide);

// ===============================
// DRIVER CHECK EARNINGS  ✅ NEW
// ===============================
router.get("/driver/earnings", protect, getDriverEarnings);

// ===============================
// GET ALL RIDES
// ===============================
router.get("/", protect, getAllRides);

// ===============================
// GET SINGLE RIDE
// ===============================
router.get("/:id", protect, getSingleRide);

router.put("/rate/:id", protect, rateRide);

router.put("/pay/:id", protect, payForRide);

module.exports = router;