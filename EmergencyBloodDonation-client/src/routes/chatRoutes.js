const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// Get chat history between two users
router.get('/:userId1/:userId2', async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            $or: [
                { senderId: req.params.userId1, receiverId: req.params.userId2 },
                { senderId: req.params.userId2, receiverId: req.params.userId1 }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send a message
router.post('/', async (req, res) => {
    const message = new ChatMessage(req.body);
    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mark messages as read
router.patch('/read', async (req, res) => {
    try {
        await ChatMessage.updateMany(
            {
                senderId: req.body.senderId,
                receiverId: req.body.receiverId,
                read: false
            },
            { read: true }
        );
        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
