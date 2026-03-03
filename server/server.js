const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ This line fixes your error
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/cab-booking")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});