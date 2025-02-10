require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const Membership = require('./api/Membership');

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MongoDB URI is missing!');
  process.exit(1);
} else {
  console.log('MongoDB URI loaded successfully');
}


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get((req, res) => {
  res.send('Server is running');
});

app.get('/api/memberships', async (req, res) => {
  console.log('Fetching memberships...');
  try {
    const memberships = await Membership.find()
      .select('membershipId userId clubId joinDate membershipStatus');  // Select necessary fields

    res.status(200).json(memberships);  // Return the populated memberships
  } catch (err) {
    console.error('Error fetching memberships:', err);
    res.status(500).json({ message: 'Error fetching memberships' });
  }
});


const port = process.env.PORT || 5000; // Use environment port or 5000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});