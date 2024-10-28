const express = require('express');
const router = express.Router();
const Donor = require('../../../EmergencyBloodDonation-server/models/Donor');

// Get all donors
router.get('/', async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new donor
router.post('/', async (req, res) => {
    const donor = new Donor({
        name: req.body.name,
        bloodType: req.body.bloodType,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location
    });

    try {
        const newDonor = await donor.save();
        res.status(201).json(newDonor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Additional routes can be added here (update, delete, get by ID)

module.exports = router;
