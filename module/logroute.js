const express = require("express");
const User = require("../models/User"); // Import the User model for database operations

const router = express.Router();

// Update profile route
router.put("/update-profile", async (req, res) => {
    const { _id, firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "First name, last name, and email are required." });
    }

    if (!_id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const userExists = await User.findById(_id);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { firstName, lastName, email },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser, // Send the updated user information back
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
