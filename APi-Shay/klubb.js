const express = require('express');
const Klubb = require('../models/klubb');

const router = express.Router();

// Fetch all clubs
router.get('/klubber', async (req, res) => {
    try {
        const klubber = await Klubb.find(); 
        res.json(klubber); 
    } catch (error) {
        console.error('Error fetching clubs from database:', error);
        res.status(500).json({ error: 'Failed to fetch clubs from database' });
    }
});

// Fetch a specific club by clubId
router.get('/klubber/:clubId', async (req, res) => {
    try {
        const { clubId } = req.params;
        const klubb = await Klubb.findOne({clubId}); 

        if (!klubb) {
            return res.status(404).json({ error: 'Club not found' });
        }

        res.json(klubb);
    } catch (error) {
        console.error('Error fetching club by ID:', error);
        res.status(500).json({ error: 'Failed to fetch club by ID' });
    }
});

module.exports = router;
