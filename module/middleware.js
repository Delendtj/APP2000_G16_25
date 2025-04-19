const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDF = require('../models/pdf'); // Import the PDF model
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploadsmulter/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  },
});

router.post('/upload', (req, res) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      if (err.message === 'Only PDF files are allowed.') {
        return res.status(400).json({ error: err.message });
      }
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    const { clubId } = req.body; // Get the clubId from the request body
    if (!clubId) {
      return res.status(400).json({ error: 'clubId is required.' });
    }

    try {
      // Save the PDF metadata to the database
      const pdf = new PDF({
        name: req.file.originalname,
        url: `/uploadsmulter/${req.file.filename}`, // Path to access the file
        clubId, // Associate the file with the club
      });

      await pdf.save();

      res.status(200).json({ message: 'File uploaded successfully!', pdf });
    } catch (error) {
      console.error('Error saving PDF metadata:', error);
      res.status(500).json({ error: 'Failed to save PDF metadata.' });
    }
  });
});

module.exports = router;