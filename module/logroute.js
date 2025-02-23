const express = require("express");
const User = require("../models/User"); // Your User model

const router = express.Router();

// Update profile route
router.put("/update-profile", async (req, res) => {
    const { _id, firstName, lastName, email } = req.body;

    console.log("Received _id:", _id); // Debugging log

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

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { firstName, lastName, email },
            { new: true } // Return the updated document
        );

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
