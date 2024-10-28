const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create/Update user profile
router.post('/profile', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.body.firebaseUid },
            req.body,
            { new: true, upsert: true }
        );
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update donation availability
router.patch('/:id/availability', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.params.id },
            { isAvailable: req.body.isAvailable },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
