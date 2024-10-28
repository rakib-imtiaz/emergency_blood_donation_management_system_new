const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    lastDonationDate: {
        type: Date,
        default: null
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);
