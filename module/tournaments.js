const express = require('express');
const router = express.Router();
const Tournament = require('../models/tournaments');

// lagd av DL
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

// Generated av Claude AI
router.put('/tournaments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, location, courseId, clubId, userId } = req.body;

  if (!name || !startDate || !endDate || !location || !courseId || !clubId || !userId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedTournament = await Tournament.findByIdAndUpdate(
      id, 
      { name, startDate, endDate, location, courseId, clubId, userId },
      { new: true } // Returns the updated document
    );

    if (!updatedTournament) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }

    res.status(200).json(updatedTournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    res.status(500).json({ error: 'Failed to update tournament.' });
  }
});

// Delete a tournament
router.delete('/tournaments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTournament = await Tournament.findByIdAndDelete(id);
    
    if (!deletedTournament) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }
    
    res.status(200).json({ message: 'Tournament deleted successfully.' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ error: 'Failed to delete tournament.' });
  }
});

module.exports = router;