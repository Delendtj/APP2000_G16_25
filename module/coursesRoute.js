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

module.exports = router;
