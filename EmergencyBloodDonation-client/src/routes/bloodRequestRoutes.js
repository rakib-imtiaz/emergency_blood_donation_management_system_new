const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');

// Get all blood requests
router.get('/', async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate('requesterId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new blood request
router.post('/', async (req, res) => {
    const request = new BloodRequest(req.body);
    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update request status
router.patch('/:id/status', async (req, res) => {
    try {
        const request = await BloodRequest.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get requests by user
router.get('/user/:userId', async (req, res) => {
    try {
        const requests = await BloodRequest.find({ requesterId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
