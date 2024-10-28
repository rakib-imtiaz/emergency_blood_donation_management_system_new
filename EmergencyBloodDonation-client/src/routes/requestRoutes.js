const express = require('express');
const router = express.Router();
const Request = require('../../../EmergencyBloodDonation-server/models/Request');

// Get all requests
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create request
router.post('/', async (req, res) => {
    try {
        const request = new Request(req.body);
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
