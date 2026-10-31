const mongoose = require("mongoose");

const trainingProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    date: {
      type: Date
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingProgram", trainingProgramSchema);