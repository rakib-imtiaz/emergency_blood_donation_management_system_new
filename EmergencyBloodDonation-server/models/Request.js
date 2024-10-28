const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    units: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['urgent', 'normal'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
