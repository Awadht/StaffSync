const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const announcementRoutes = require("./routes/announcementRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Employee API routes
app.use("/api/employees", employeeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/training", trainingRoutes);
app.use("/api/auth", authRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("StaffSync Server is running!");
});

const PORT = 5000;

// Connect MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});