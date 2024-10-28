const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    default: 'User'
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    default: ''
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  location: {
    type: {
      lat: Number,
      lng: Number
    },
    default: null
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
