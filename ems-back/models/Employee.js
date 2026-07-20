const mongoose = require("mongoose");

const requiredText = { type: String, required: true, trim: true, minlength: 1, maxlength: 80 };

const EmployeeSchema = new mongoose.Schema(
  {
    FirstName: requiredText,
    LastName: requiredText,
    Age: { type: Number, required: true, min: 20, max: 70 },
    DateOfJoining: { type: Date, required: true },
    Title: requiredText,
    Department: requiredText,
    EmployeeType: requiredText,
    CurrentStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
