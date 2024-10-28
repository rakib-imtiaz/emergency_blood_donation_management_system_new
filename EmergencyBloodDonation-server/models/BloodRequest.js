const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    division: String,
    district: String,
    address: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['immediate', 'within24hrs', 'within3days', 'planned'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  medicalReason: String,
  contactNumber: String,
  additionalNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
