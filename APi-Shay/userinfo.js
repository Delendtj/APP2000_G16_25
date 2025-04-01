const express = require('express');
const User = require('../models/User'); // Import the User model

const router = express.Router();

// Endpoint to get user data by userId
router.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by userId
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user); // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

module.exports = router;