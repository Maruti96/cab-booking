const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropLocation: {
      type: String,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

   status: {
  type: String,
  enum: ["Pending", "Accepted", "Completed", "Cancelled"],
  default: "Pending",
},
rating: {
  type: Number,
  min: 1,
  max: 5,
},
paymentStatus: {
  type: String,
  enum: ["Pending", "Paid"],
  default: "Pending",
},

paymentMethod: {
  type: String,
  enum: ["Cash", "UPI", "Card"],
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);