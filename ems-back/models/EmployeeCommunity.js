const mongoose = require('mongoose');

const EmployeeCommunitySchema = new mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true,
  },
  ClubName: { type: String, required: true, trim: true, maxlength: 50 },
  NumberOfMembers: { type: Number, required: true, min: 4, max: 20 },
});

module.exports = mongoose.model('EmployeeCommunity', EmployeeCommunitySchema);
