const express = require("express");

const router = express.Router();

const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET all leave requests
router.get(
  "/",
  protect,
  authorize("HR", "Manager", "Employee"),
  async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employeeId")
      .populate("approvedBy");

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leave requests",
      error: error.message
    });
  }
});

// GET one leave request
router.get(
  "/:id",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate("employeeId")
      .populate("approvedBy");

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leave request",
      error: error.message
    });
  }
});

// APPLY FOR LEAVE
router.post("/", protect, authorize("Employee", "Manager", "HR"), async (req, res) => {
  try {
    console.log("LEAVE REQUEST BODY:", req.body);
    const { employeeId, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({
      employeeId: employeeId
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const leave = new LeaveRequest({
      employeeId: employee._id,
      startDate,
      endDate,
      reason
    });

    const savedLeave = await leave.save();

    res.status(201).json(savedLeave);

  } catch (error) {
  console.error("LEAVE ERROR:", error);

  res.status(500).json({
    message: error.message
  });
}
});

// APPROVE / REJECT LEAVE
// UPDATE / APPROVE / REJECT LEAVE REQUEST
router.put(
  "/:id",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          message: "Status must be Approved or Rejected"
        });
      }

      const leave = await LeaveRequest.findById(req.params.id);

      if (!leave) {
        return res.status(404).json({
          message: "Leave request not found"
        });
      }

      leave.status = status;

      // Store the logged-in HR/Manager as the approver
      leave.approvedBy = req.user.id;

      const updatedLeave = await leave.save();

      const result = await LeaveRequest.findById(updatedLeave._id)
        .populate("employeeId")
        .populate("approvedBy");

      res.json(result);

    } catch (error) {
      res.status(500).json({
        message: "Error updating leave request",
        error: error.message
      });
    }
  }
);

module.exports = router;