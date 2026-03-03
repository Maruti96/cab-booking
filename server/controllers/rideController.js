const Ride = require("../models/Ride");
const User = require("../models/User");

// ===============================
// USER BOOK RIDE
// ===============================
exports.createRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, fare } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can book rides",
      });
    }

    if (!pickupLocation || !dropLocation || !fare) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const ride = await Ride.create({
      user: req.user.id,
      pickupLocation,
      dropLocation,
      fare,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking ride",
      error: error.message,
    });
  }
};


// ===============================
// DRIVER ACCEPT RIDE
// ===============================
exports.acceptRide = async (req, res) => {
  try {

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can accept rides",
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Ride already accepted, completed or cancelled",
      });
    }

    ride.status = "Accepted";
    ride.driver = req.user.id;

    await ride.save();

    res.json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error accepting ride",
      error: error.message,
    });
  }
};


// ===============================
// DRIVER COMPLETE RIDE + EARNINGS
// ===============================
exports.completeRide = async (req, res) => {
  try {

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can complete rides",
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (!ride.driver || ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this ride",
      });
    }

    if (ride.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Ride is not in accepted state",
      });
    }

    ride.status = "Completed";

    // 💰 80% Earnings Logic
    const driver = await User.findById(req.user.id);
    const driverShare = ride.fare * 0.8;

    driver.earnings += driverShare;
    await driver.save();

    await ride.save();

    res.json({
      success: true,
      message: "Ride completed successfully",
      driverEarned: driverShare,
      totalEarnings: driver.earnings,
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing ride",
      error: error.message,
    });
  }
};


// ===============================
// USER CANCEL RIDE
// ===============================
exports.cancelRide = async (req, res) => {
  try {

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can cancel rides",
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own ride",
      });
    }

    if (ride.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending rides can be cancelled",
      });
    }

    ride.status = "Cancelled";
    await ride.save();

    res.json({
      success: true,
      message: "Ride cancelled successfully",
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling ride",
      error: error.message,
    });
  }
};


// ===============================
// GET ALL RIDES
// ===============================
exports.getAllRides = async (req, res) => {
  try {

    const rides = await Ride.find()
      .populate("user", "name email role")
      .populate("driver", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rides.length,
      rides,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching rides",
      error: error.message,
    });
  }
};


// ===============================
// GET SINGLE RIDE
// ===============================
exports.getSingleRide = async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id)
      .populate("user", "name email")
      .populate("driver", "name email");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.json({
      success: true,
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ride",
      error: error.message,
    });
  }
};


// ===============================
// DRIVER CHECK EARNINGS
// ===============================
exports.getDriverEarnings = async (req, res) => {
  try {

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can view earnings",
      });
    }

    const driver = await User.findById(req.user.id);

    res.json({
      success: true,
      totalEarnings: driver.earnings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching earnings",
      error: error.message,
    });
  }
};
// ===============================
// USER RATE RIDE
// ===============================
exports.rateRide = async (req, res) => {
  try {

    const { rating } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can rate rides",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only rate your own ride",
      });
    }

    if (ride.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "You can only rate completed rides",
      });
    }

    if (ride.rating) {
      return res.status(400).json({
        success: false,
        message: "Ride already rated",
      });
    }

    ride.rating = rating;
    await ride.save();

    // Update Driver Rating
    const driver = await require("../models/User").findById(ride.driver);

    const newTotalRatings = driver.totalRatings + 1;
    const newAverage =
      (driver.rating * driver.totalRatings + rating) / newTotalRatings;

    driver.rating = newAverage;
    driver.totalRatings = newTotalRatings;

    await driver.save();

    res.json({
      success: true,
      message: "Ride rated successfully",
      driverNewRating: driver.rating,
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rating ride",
      error: error.message,
    });
  }
};

// ===============================
// USER PAY FOR RIDE
// ===============================
exports.payForRide = async (req, res) => {
  try {

    const { paymentMethod } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can make payments",
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own ride",
      });
    }

    if (ride.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed rides can be paid",
      });
    }

    if (ride.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Ride already paid",
      });
    }

    ride.paymentStatus = "Paid";
    ride.paymentMethod = paymentMethod;

    await ride.save();

    res.json({
      success: true,
      message: "Payment successful",
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};

