const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/, // Validates email format
  },
  activity: {
    type: String,
    required: true,
  },
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
