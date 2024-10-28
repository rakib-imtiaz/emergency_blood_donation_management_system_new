const express = require('express');
const router = express.Router();
const DonationHistory = require('../models/DonationHistory');
const User = require('../models/User');

// Get donation history for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const history = await DonationHistory.find({ donorId: req.params.userId })
            .populate('requestId')
            .sort({ donationDate: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Record new donation
router.post('/', async (req, res) => {
    const session = await DonationHistory.startSession();
    session.startTransaction();

    try {
        const donation = new DonationHistory(req.body);
        await donation.save({ session });

        // Update user's last donation date and total donations
        await User.findByIdAndUpdate(
            req.body.donorId,
            {
                $set: { lastDonationDate: req.body.donationDate },
                $inc: { totalDonations: 1 }
            },
            { session }
        );

        await session.commitTransaction();
        res.status(201).json(donation);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
