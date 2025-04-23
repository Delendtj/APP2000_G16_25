const express = require("express");
const mongoose = require("mongoose");
const Course = require("../models/courses");
const router = express.Router();

// GET All Courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.stack);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/courses/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    
    // Convert clubId to number since it's stored as a number in the schema
    const clubIdNum = parseInt(clubId);
    
    if (isNaN(clubIdNum)) {
      return res.status(400).json({ error: "Invalid club ID format" });
    }
    
    const courses = await Course.find({ clubId: clubIdNum });
    
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this club" });
    }
    
    res.json(courses);
  } catch (err) {
    console.error(`Error fetching courses for club ${req.params.clubId}:`, err.stack);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
