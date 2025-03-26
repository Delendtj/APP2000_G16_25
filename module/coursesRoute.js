const express = require("express");
const mongoose = require("mongoose");
const Course = require("../models/courses");
const router = express.Router();

// GET All Courses
router.get("/courses", async (req, res) => {
  try {
    console.log("Checking MongoDB Connection...");
    console.log("Mongoose Connection State:", mongoose.connection.readyState);

    console.log("Fetching courses from MongoDB...");
    const courses = await Course.find();

    if (courses.length === 0) {
      console.warn("No courses found in MongoDB!");
    } else {
      console.log("Courses found:", JSON.stringify(courses, null, 2));
    }

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.stack);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
