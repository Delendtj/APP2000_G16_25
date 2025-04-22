const express = require("express");
const router = express.Router();
const Hole = require("../models/hole");
const Course = require("../models/courses");

const verifyAccess = async (req, res, next) => {
  try {
    let courseId = req.body.courseId;

    if (!courseId && req.params.id) {
      const Hole = require('../models/hole');
      const hole = await Hole.findById(req.params.id);
      if (hole) courseId = hole.courseId;
    }

    if (!courseId) {
      return res.status(400).json({ error: "courseId mangler." });
    }

    const Course = require('../models/courses');
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ error: "Bane ikke funnet." });
    }

    const user = req.body.user || JSON.parse(req.headers['authorization'] || '{}');

   
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Ingen tilgang – kun admin kan redigere." });
    }

    req.course = course;
    req.user = user;
    next();
  } catch (error) {
    console.error("Feil i tilgangssjekk:", error);
    return res.status(500).json({ error: "Serverfeil under tilgangssjekk." });
  }
};


const loadHoleAndCourse = async (req, res, next) => {
  try {
    const hole = await Hole.findById(req.params.id);
    if (!hole) return res.status(404).json({ error: "Hull ikke funnet." });

    req.hole = hole;
    req.body.courseId = hole.courseId;
    next();
  } catch (err) {
    console.error("Feil ved lasting av hull:", err);
    return res.status(500).json({ error: "Serverfeil." });
  }
};

// Opprett nytt hull
router.post("/holes", verifyAccess, async (req, res) => {
  try {
    const newHole = new Hole(req.body);
    await newHole.save();
    res.status(201).json({ message: "Hull lagret", hole: newHole });
  } catch (error) {
    console.error("Feil ved lagring av hull:", error);
    res.status(500).json({ error: "Kunne ikke lagre hullet." });
  }
});

// Oppdater hull
router.put("/holes/:id", loadHoleAndCourse, verifyAccess, async (req, res) => {
  try {
    const updatedHole = await Hole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHole) {
      return res.status(404).json({ error: "Hull ikke funnet." });
    }
    res.json({ message: "Hull oppdatert", hole: updatedHole });
  } catch (error) {
    console.error("Feil ved oppdatering:", error);
    res.status(500).json({ error: "Kunne ikke oppdatere hullet." });
  }
});

// Slett hull
router.delete("/holes/:id", loadHoleAndCourse, verifyAccess, async (req, res) => {
  try {
    await Hole.findByIdAndDelete(req.params.id);
    res.json({ message: "Hull slettet" });
  } catch (error) {
    console.error("Feil ved sletting:", error);
    res.status(500).json({ error: "Kunne ikke slette hullet." });
  }
});

// Hent hull for en bane
router.get("/holes/courses/:courseId", async (req, res) => {
  try {
    const holes = await Hole.find({ courseId: req.params.courseId });
    res.json(holes);
  } catch (error) {
    console.error("Feil ved henting av hull:", error);
    res.status(500).json({ error: "Kunne ikke hente hull." });
  }
});

module.exports = router;
