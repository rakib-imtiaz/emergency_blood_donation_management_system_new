const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  donationDate: {
    type: Date,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  location: {
    division: String,
    district: String,
    facility: String
  },
  units: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'no-show'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DonationHistory', donationHistorySchema);
