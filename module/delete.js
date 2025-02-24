const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// DELETE User Endpoint
router.delete("/delete-user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid user ID format.",
                details: { userId: id, message: "Not a valid MongoDB ObjectId." }
            });
        }

        // Check if the logged-in user is deleting their own account
        const loggedInUser = JSON.parse(req.headers.authorization || '{}');  // Assuming user info is passed via header from the client
        if (!loggedInUser || loggedInUser._id !== id) {
            return res.status(403).json({
                error: "Unauthorized to delete this account.",
                details: { userId: id, message: "You can only delete your own account." }
            });
        }

        // Find user by ID to confirm existence before deleting
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({
                error: "User not found.",
                details: { userId: id, message: "No user exists with the given ID." }
            });
        }

        // Perform user deletion
        await User.findByIdAndDelete(id);

        // Return success message along with deleted user's info
        res.status(200).json({
            message: "User deleted successfully",
            deletedUser: {
                _id: userToDelete._id,
                firstName: userToDelete.firstName,
                lastName: userToDelete.lastName,
                email: userToDelete.email
            }
        });

    } catch (error) {
        console.error("Error deleting user:", error);

        // If an error occurs, return a detailed error message along with user info
        const userAttempted = await User.findById(req.params.id);
        res.status(500).json({
            error: "Server error. Could not delete user.",
            details: {
                userId: req.params.id,
                attemptedUser: userAttempted || "User not found before deletion",
                errorMessage: error.message || "No additional error details."
            }
        });
    }
});

module.exports = router;
