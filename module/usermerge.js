const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Membership = require('../models/Membership');
//DL
router.get("/usersclub", async (req, res) => {
  try {
    console.log("Fetching users with club IDs...");
    
    // find alt
    const memberships = await Membership.find();
    console.log(`Found ${memberships.length} memberships`);
    
    if (memberships.length === 0) {
      return res.status(200).json([]);
    }

    // Create map av UId til MId
    const userClubMap = {};
    memberships.forEach((membership) => {
      userClubMap[membership.userId] = {
        clubId: membership.clubId,
        membershipId: membership.membershipId
      };
    });
    
    console.log(`Created user-club map with ${Object.keys(userClubMap).length} entries`);
    
    // Get uId fra map
    const userIds = Object.keys(userClubMap);
    const users = await User.find({ userId: { $in: userIds } }, "-passwordhash");    

    const usersWithClub = users.map(user => {
      const userIdStr = user.userId.toString();
      return {
        ...user.toObject(),
        clubId: userClubMap[userIdStr]?.clubId,
        membershipId: userClubMap[userIdStr]?.membershipId, // Add membership ID
      };
    });
    
    return res.status(200).json(usersWithClub);
    
  } catch (error) {
    console.error("Error in /usersclub endpoint:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message 
    });
  }
});

module.exports = router;