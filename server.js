require("dotenv").config();

//DL

// Import necessary modules
const express = require("express");  
const mongoose = require("mongoose"); 
const cors = require("cors"); 
const next = require("next"); 
const router = require("./module/auth");

// Check if environment is dev or prod
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev }); // Next.js dev mode
const handle = app.getRequestHandler(); 


const updateProfileRoute = require('./module/logroute'); // Adjust path
const deleteProfileRoute = require('./module/delete');
  
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
  const Membership = require("./models/Membership"); // Import schema model
  const User = require("./models/User");

  
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
  server.post("/api/users", async (req, res) => {
    try {
        const { firstName, lastName, email, passwordHash } = req.body;

        if (!firstName || !lastName || !email || !passwordHash) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists." });
        }

        // Create new user
        const newUser = new User({ firstName, lastName, email, passwordHash });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error. Try again later." });
    }
});

server.use('/api', updateProfileRoute);
server.use('/api', deleteProfileRoute);


server.get("/api/users", async (req, res) => {
  try {
      const users = await User.find({}, "-passwordhash"); // Exclude passwordhash 
      return res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});


server.use("/api", router); 

  //chatgpt hjalp med oppstart i heroku
  // Håndterer routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res); // Request handling til Next.js
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, (err) => {
    if (err) throw err; // Throw error
    console.log(`Server running on http://localhost:${PORT}`); //success message
  });
});
