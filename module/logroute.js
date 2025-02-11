const express = require("express");
const User = require("../models/User"); // Your User model

const router = express.Router();

// Update profile route
router.put("/update-profile", async (req, res) => {
    const { _id, name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
    }

    if (!_id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id, // Use the _id passed from the frontend
            { name, email },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser, 
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
