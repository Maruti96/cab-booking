const User = require("../models/User");
const Ride = require("../models/Ride");

// ===============================
// GET ALL USERS
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};


// ===============================
// ADMIN DASHBOARD STATS
// ===============================
exports.getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDrivers = await User.countDocuments({ role: "driver" });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: "Completed" });

    const completedRideData = await Ride.find({ status: "Completed" });

    let totalRevenue = 0;

    completedRideData.forEach((ride) => {
      totalRevenue += ride.fare * 0.2; // Company 20%
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDrivers,
        totalRides,
        completedRides,
        totalRevenue,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};