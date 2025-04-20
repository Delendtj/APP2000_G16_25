const express = require('express');
const router = express.Router();
const Tournament = require('../models/tournaments');

// Create a new tournament
router.post('/tournaments', async (req, res) => {
  const { name, startDate, endDate, location, courseId, clubId, userId } = req.body;

  if (!name || !startDate || !endDate || !location || !courseId || !clubId || !userId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const tournament = new Tournament({ name, startDate, endDate, location, courseId, clubId, userId });
    await tournament.save();
    res.status(201).json({ message: 'Tournament created successfully!', tournament });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Failed to create tournament.' });
  }
});

router.get('/tournaments/:clubId', async (req, res) => {
  const { clubId } = req.params;

  try {
    const tournaments = await Tournament.find({ clubId });
    res.status(200).json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments.' });
  }
});

module.exports = router;