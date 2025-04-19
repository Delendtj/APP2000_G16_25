const express = require('express');
const router = express.Router();
const PDF = require('../models/pdf'); // A model to store PDF metadata

// Fetch PDFs for a specific club
router.get('/pdfs/:clubId', async (req, res) => {
    const { clubId } = req.params;

    try {
        console.log(`Fetching PDFs for club ID: ${clubId}`);
        const pdfs = await PDF.find({ clubId });

        if (!pdfs || pdfs.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({ error: 'Failed to fetch PDFs' });
    }
});

module.exports = router;