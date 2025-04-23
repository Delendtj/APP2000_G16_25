const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Club Page model (if not already defined elsewhere)
const ClubPageSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    default: 'Velkommen til klubbsiden'
  },
  content: {
    type: String,
    required: true,
    default: 'Dette er klubbsiden hvor medlemmer kan finne relevant informasjon.'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create model if it doesn't exist
const ClubPage = mongoose.models.ClubPage || mongoose.model('ClubPage', ClubPageSchema);

// GET route to retrieve page content for a specific club
router.get("/clubs/:clubId/page", async (req, res) => {
  try {
    const { clubId } = req.params;
    
    if (!clubId) {
      return res.status(400).json({ error: "Club ID is required" });
    }
    
    // Try to find existing page content for this club
    let pageContent = await ClubPage.findOne({ clubId });
    
    // If none exists, create default content
    if (!pageContent) {
      pageContent = {
        title: 'Velkommen til klubbsiden',
        content: 'Dette er klubbsiden hvor medlemmer kan finne relevant informasjon.'
      };
    }
    
    return res.status(200).json(pageContent);
    
  } catch (error) {
    console.error(`Error fetching page content for club ${req.params.clubId}:`, error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message 
    });
  }
});

// POST route to save/update page content for a specific club
router.post("/clubs/:clubId/page", async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, content } = req.body;
    
    if (!clubId) {
      return res.status(400).json({ error: "Club ID is required" });
    }
    
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    
    // Update or create page content
    const updatedPage = await ClubPage.findOneAndUpdate(
      { clubId },
      { 
        title, 
        content,
        lastUpdated: Date.now()
      },
      { new: true, upsert: true }
    );
    
    return res.status(200).json({
      message: "Page content updated successfully",
      page: updatedPage
    });
    
  } catch (error) {
    console.error(`Error updating page content for club ${req.params.clubId}:`, error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message 
    });
  }
});

module.exports = router;