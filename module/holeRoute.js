const express = require("express");
const router = express.Router();
const Hole = require("../models/hole");
const Course = require("../models/courses");


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
router.post("/holes", async (req, res) => {
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
router.put("/holes/:id", loadHoleAndCourse, async (req, res) => {
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
router.delete("/holes/:id", loadHoleAndCourse, async (req, res) => {
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
