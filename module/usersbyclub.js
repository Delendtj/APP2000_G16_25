const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Membership = require('../models/Membership');

router.get("/usersbyclub/:clubId", async (req, res) => {
  const { clubId } = req.params;
  
  try {
    // Find all memberships for the given clubId
    const memberships = await Membership.find({ clubId });
    
    if (memberships.length === 0) {
      return res.status(200).json([]);
    }
    
    // Create a map of userId to membershipId
    const membershipMap = {};
    memberships.forEach(membership => {
      membershipMap[membership.userId] = {
        membershipId: membership.membershipId,
        membershipStatus: membership.membershipStatus
      };
    });
    
    // Extract userIds from memberships
    const userIds = memberships.map(membership => membership.userId);
    
    // Fetch users whose IDs match the userIds from memberships
    const users = await User.find({ userId: { $in: userIds } }, "-passwordhash");
    
    // Add membership details to each user object
    const usersWithMembership = users.map(user => {
      const userObj = user.toObject();
      const userId = userObj.userId.toString();
      return {
        ...userObj,
        clubId,
        membershipId: membershipMap[userId]?.membershipId,
        membershipStatus: membershipMap[userId]?.membershipStatus || 'inactive'
      };
    });
    
    return res.status(200).json(usersWithMembership);
  } catch (error) {
    console.error(`Error fetching users for club ${clubId}:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;