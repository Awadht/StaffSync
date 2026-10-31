const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET all attendance records
router.get("/", protect, authorize("HR", "Manager"), async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message
    });
  }
});

// GET attendance for the logged-in employee
router.get("/my", protect, authorize("Employee"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const employee = await Employee.findOne({
      email: user.email
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee record not found"
      });
    }

    const attendance = await Attendance.find({
      employeeId: employee._id
    }).populate("employeeId");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your attendance",
      error: error.message
    });
  }
});

// GET one attendance record
router.get(
  "/:id",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("employeeId");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found"
      });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance record",
      error: error.message
    });
  }
});

// ADD attendance
router.post("/", protect, authorize("HR", "Manager"), async (req, res) => {
  try {
    const attendance = new Attendance({
      employeeId: req.body.employeeId,
      date: req.body.date,
      status: req.body.status
    });

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({
      message: "Error adding attendance",
      error: error.message
    });
  }
});

// UPDATE attendance
router.put(
  "/:id",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
    try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        employeeId: req.body.employeeId,
        date: req.body.date,
        status: req.body.status
      },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found"
      });
    }

    res.json(attendance);
  } catch (error) {
    res.status(400).json({
      message: "Error updating attendance",
      error: error.message
    });
  }
});

module.exports = router;