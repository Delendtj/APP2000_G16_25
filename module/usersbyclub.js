const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Membership = require('../models/Membership');

router.get("/usersbyclub/:clubId", async (req, res) => {
    const { clubId } = req.params;
    
    console.log(`API Request: /usersbyclub/${clubId}`);
    
    if (!clubId) {
      return res.status(400).json({ error: "Club ID is required" });
    }
    
    try {
      console.log(`Fetching memberships for club ID: ${clubId}`);
      
      // Find all memberships for the given clubId
      const memberships = await Membership.find({ clubId });
      console.log(`Found ${memberships.length} memberships for club ${clubId}`);
      
      if (memberships.length === 0) {
        return res.status(200).json([]);
      }
      
      // Extract userIds from memberships
      const userIds = memberships.map(membership => membership.userId);
      
      // Fetch users whose IDs match the userIds from memberships
      const users = await User.find({ userId: { $in: userIds } }, "-passwordhash");
      console.log(`Found ${users.length} users for club ${clubId}`);
      
      // Add clubId to each user object
      const usersWithClub = users.map(user => ({
        ...user.toObject(),
        clubId
      }));
      
      return res.status(200).json(usersWithClub);
      
    } catch (error) {
      console.error(`Error fetching users for club ${req.params.clubId}:`, error);
      return res.status(500).json({ 
        error: "Internal Server Error", 
        message: error.message 
      });
    }
  });

  module.exports = router;