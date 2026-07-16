const mongoose = require('mongoose');

const EmployeeCommunitySchema = new mongoose.Schema({
  EmployeeName: { type: String, required: true },
  DepartmentName: { type: String, required: true },
  ClubName: { type: String, required: true },
  NumberOfMembers: { type: Number, required: true },
});

module.exports = mongoose.model('EmployeeCommunity', EmployeeCommunitySchema);