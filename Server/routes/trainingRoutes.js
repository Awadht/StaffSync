const express = require("express");
const router = express.Router();

const TrainingProgram = require("../models/TrainingProgram");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET all training programs
router.get("/", protect, authorize("HR", "Manager","Employee"), async (req, res) => {
  try {
    const trainingPrograms = await TrainingProgram.find()
      .populate("managerId");

    res.json(trainingPrograms);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching training programs",
      error: error.message
    });
  }
});

// GET one training program
router.get("/:id", protect, authorize("HR", "Manager","Employee"), async (req, res) => {
  try {
    const trainingProgram = await TrainingProgram.findById(req.params.id)
      .populate("managerId");

    if (!trainingProgram) {
      return res.status(404).json({
        message: "Training program not found"
      });
    }

    res.json(trainingProgram);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching training program",
      error: error.message
    });
  }
});

// CREATE training program
router.post("/", protect, authorize("Manager"), async (req, res) => {
  try {
    const trainingProgram = new TrainingProgram({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      managerId: req.user.id
    });

    const savedTrainingProgram = await trainingProgram.save();

    res.status(201).json(savedTrainingProgram);
  } catch (error) {
    res.status(400).json({
      message: "Error creating training program",
      error: error.message
    });
  }
});

// UPDATE training program
router.put(
  "/:id",
  protect,
  authorize("Manager"),
  async (req, res) => {
  try {
    const trainingProgram =
      await TrainingProgram.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
          managerId: req.body.managerId
        },
        { new: true }
      );

    if (!trainingProgram) {
      return res.status(404).json({
        message: "Training program not found"
      });
    }

    res.json(trainingProgram);
  } catch (error) {
    res.status(400).json({
      message: "Error updating training program",
      error: error.message
    });
  }
});

// DELETE training program
router.delete("/:id", protect, authorize("Manager"), async (req, res) => {
  try {
    const trainingProgram =
      await TrainingProgram.findByIdAndDelete(req.params.id);

    if (!trainingProgram) {
      return res.status(404).json({
        message: "Training program not found"
      });
    }

    res.json({
      message: "Training program deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting training program",
      error: error.message
    });
  }
});

module.exports = router;