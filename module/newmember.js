const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');

// API endpoint to create a new membership
router.post("/newmember", async (req, res) => {
  const { userId, clubId } = req.body;

  // Validate input
  if (!userId || !clubId) {
    return res.status(400).json({ error: "userId and clubId are required" });
  }

  try {
    // Create a new membership document
    const newMembership = new Membership({
      membershipId: Math.floor(Math.random() * 1000000), // Generate a unique ID
      userId,
      clubId,
      membershipStatus: "active", // Default status
    });

    // Save the membership to the database
    await newMembership.save();

    res.status(201).json({ message: "Membership created successfully", membership: newMembership });
  } catch (err) {
    console.error("Error creating membership:", err);
    res.status(500).json({ error: "Failed to create membership" });
  }
});

module.exports = router;