require("dotenv").config();

//DL

// Import necessary modules
const express = require("express");  
const mongoose = require("mongoose"); 
const cors = require("cors"); 
const next = require("next"); 
const router = express.Router();

// Check if environment is dev or prod
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev }); // Next.js dev mode
const handle = app.getRequestHandler(); 

// Prepare Next.js start Express server
app.prepare().then(() => {
  const server = express();

  // Middleware 
  server.use(cors()); // Enable CORS
  server.use(express.json()); // Enable JSON

  // MongoDB Connection
  const mongoURI = process.env.MONGODB_URI; // Get  URI fra .env
  if (!mongoURI) {
    console.error("Error: Missing MONGODB_URI in environment variables."); // Log if URI is missing //viktig for local dev, men kan kommenters ut i prod, siden URI er lagret i heroku
    process.exit(1); // Exit process failure 
  }

  // Connect til DB med Mongoose
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected")) // Log success
    .catch((err) => {
      console.error("MongoDB connection error:", err); // Log error if fail
      process.exit(1); //fail code
    });

  // API Route for schemas
  const Membership = require("./api/Membership"); // Import schema model
  const FormModel = require("./api/User");

  //API endpoint for memberships
  server.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await Membership.find(); // Fetch all membership fra DB
      res.json(memberships); //data as JSON 
    } catch (err) {
      console.error("Error fetching memberships:", err); // Log error if fail
      res.status(500).json({ error: "Server error" }); // Send a 500 Error 
    }
  });

  //API endpoint for form submission 
  router.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newForm = new FormModel({ name, email, message });
        await newForm.save();

        res.status(201).json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({ error: "Error submitting form" });
    }
});


  //chatgpt hjalp med oppstart i heroku
  // Håndterer routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res); // Request handling til Next.js
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, (err) => {
    if (err) throw err; // Throw error
    console.log(`🚀 Server running on http://localhost:${PORT}`); //success message
  });
});
