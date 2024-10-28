const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  donorEmail: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  donationDate: {
    type: Date,
    required: true
  },
  donationTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lastDonationDate: {
    type: Date
  },
  anyMedicalConditions: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  additionalNotes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
