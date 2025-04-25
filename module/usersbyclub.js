const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Membership = require('../models/Membership');

//DL 
router.get("/usersbyclub/:clubId", async (req, res) => {
  const { clubId } = req.params;
  
  try {
    // finn alle members for CId
    const memberships = await Membership.find({ clubId });
    
    if (memberships.length === 0) {
      return res.status(200).json([]);
    }
    
    //lag en map fra UId til MId
    const membershipMap = {};
    memberships.forEach(membership => {
      membershipMap[membership.userId] = {
        membershipId: membership.membershipId,
        membershipStatus: membership.membershipStatus
      };
    });
    
    //få MId fra map
    const userIds = memberships.map(membership => membership.userId);
    
    // match
    const users = await User.find({ userId: { $in: userIds } }, "-passwordhash");
    
    // Add details til object
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