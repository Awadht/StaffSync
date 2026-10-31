const express = require("express");

const router = express.Router();

const Employee = require("../models/Employee");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");
// GET logged-in employee profile
router.get(
  "/my",
  protect,
  authorize("Employee"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const employee = await Employee.findOne({
        email: user.email,
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee record not found",
        });
      }

      res.json(employee);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// GET all employees
router.get(
  "/",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
  try {
    const employees = await Employee.find();

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message
    });
  }
});

// GET employee by ID
router.get("/:id", protect, authorize("HR", "Manager"), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employee",
      error: error.message
    });
  }
});

// ADD employee
router.post(
  "/",
  protect,
  authorize("HR"),
  async (req, res) => {
  try {
    const employee = new Employee(req.body);

    const savedEmployee = await employee.save();

    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({
      message: "Error adding employee",
      error: error.message
    });
  }
});

// UPDATE employee
router.put(
  "/:id",
  protect,
  authorize("HR"),
  async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({
      message: "Error updating employee",
      error: error.message
    });
  }
});

// DELETE employee
router.delete("/:id", protect, authorize("HR"), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting employee",
      error: error.message
    });
  }
});

// GET MY OWN EMPLOYEE PROFILE
router.get(
  "/me",
  protect,
  authorize("Employee"),
  async (req, res) => {
    try {
      const employee = await Employee.findOne({
        email: req.user.email
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee profile not found"
        });
      }

      res.json(employee);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching employee profile",
        error: error.message
      });
    }
  }
);

module.exports = router;