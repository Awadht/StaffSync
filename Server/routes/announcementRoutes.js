const express = require("express");
const router = express.Router();

const Announcement = require("../models/Announcement");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET all announcements
router.get("/", protect, authorize("HR", "Manager","Employee"), async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy");

    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching announcements",
      error: error.message
    });
  }
});

// GET one announcement
router.get("/:id", protect, authorize("HR", "Manager","Employee"), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("postedBy");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching announcement",
      error: error.message
    });
  }
});

// CREATE announcement
router.post("/", protect, authorize("HR", "Manager"), async (req, res) => {
  try {
    const announcement = new Announcement({
      title: req.body.title,
      message: req.body.message,
      postedBy: req.user.id
    });

    const savedAnnouncement = await announcement.save();

    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({
      message: "Error creating announcement",
      error: error.message
    });
  }
});

// UPDATE announcement
router.put(
  "/:id",
  protect,
  authorize("HR", "Manager"),
  async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        message: req.body.message
       
      },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.json(announcement);
  } catch (error) {
    res.status(400).json({
      message: "Error updating announcement",
      error: error.message
    });
  }
});

// DELETE announcement
router.delete("/:id", protect, authorize("HR", "Manager"), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.id
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.json({
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting announcement",
      error: error.message
    });
  }
});

module.exports = router;