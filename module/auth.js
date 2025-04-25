const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
//DL
const router = express.Router();
//sjekker om det er en bruker med samme email i databasen
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  
  try { 
    const user = await User.findOne({ email });
    console.log("User found in database:", user); // Debug log

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Verify password med bcrypt
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Return user data
    res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      membershipStatus: user.membershipStatus,
      isAdmin: user.isAdmin,
      userId: user.userId, // Ensure this is included
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;