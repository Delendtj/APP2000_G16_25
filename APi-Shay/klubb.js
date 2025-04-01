const express = require('express');
const Klubb = require('../models/klubb');

const router = express.Router();

router.get('/klubber', async (req, res) => {
    try {
        const klubber = await Klubb.find(); 
        res.json(klubber); 
    } catch (error) {
        console.error('Error fetching clubs from database:', error);
        res.status(500).json({ error: 'Failed to fetch clubs from database' });
    }
});

module.exports = router;
