const mongoose = require('mongoose');

const activities = [
  'Yoga Session',
  'Beach Volleyball',
  'Community Service',
  'Team Building Retreat',
  'Health and Wellness Workshop',
];

const registrationSchema = new mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    index: true,
  },
  // Kept only so existing registrations remain readable.
  name: { type: String, select: false },
  email: {
    type: String,
    match: /\S+@\S+\.\S+/,
    select: false,
  },
  activity: {
    type: String,
    required: true,
    enum: activities,
  },
}, { timestamps: true });

registrationSchema.index(
  { EmployeeId: 1, activity: 1 },
  { unique: true, partialFilterExpression: { EmployeeId: { $type: 'objectId' } } }
);

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
