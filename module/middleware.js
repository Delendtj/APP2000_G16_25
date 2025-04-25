const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDF = require('../models/pdf'); // Importerer PDF-modellen for databaseoperasjoner
const router = express.Router();

//Multer er Claude AI 
// Konfigurasjon av fillagring for opplastede filer
const storage = multer.diskStorage({
  // Definerer hvor filene skal lagres
  destination: (req, file, cb) => {
    // Setter opp mappestruktur i prosjektet for opplastede filer
    const uploadPath = path.join(__dirname, '../uploadsmulter/');
    // Oppretter mappen hvis den ikke finnes
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  // Definerer hvordan filnavnene skal genereres
  filename: (req, file, cb) => {
    // Bruker tidsstempel for å sikre unike filnavn
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Oppsett av multer for filopplasting med egendefinerte regler
const upload = multer({
  storage, // Bruker lagringskonfiugurasjonen definert ovenfor
  fileFilter: (req, file, cb) => {
    // Begrenser opplasting til kun PDF-filer
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // Godtar filen hvis den er PDF
    } else {
      cb(new Error('Only PDF files are allowed.')); // Avviser filen hvis den ikke er PDF
    }
  },
});

// POST-endepunkt for filopplasting
router.post('/upload', (req, res) => {
  // Håndterer opplasting av enkeltfil med multer
  upload.single('pdf')(req, res, async (err) => {
    // Feilhåndtering for opplastingsprosessen
    if (err) {
      // Spesifikk feilmelding for filtype-begrensning
      if (err.message === 'Only PDF files are allowed.') {
        return res.status(400).json({ error: err.message });
      }
      // Generell feillogging og -respons for andre feil
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file.' });
    }

    // Sjekker om en fil faktisk ble lastet opp
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    // Henter klubb-ID fra forespørselsobjektet
    const { clubId } = req.body;
    // Validerer at klubb-ID er angitt
    if (!clubId) {
      return res.status(400).json({ error: 'clubId is required.' });
    }

    try {
      // Oppretter en ny PDF-oppføring i databasen med metadataen
      const pdf = new PDF({
        name: req.file.originalname, // Bruker det originale filnavnet
        url: `/uploadsmulter/${req.file.filename}`, // Lagrer stien til filen
        clubId, // Kobler filen til en spesifikk klubb
      });

      // Lagrer metadataen til databasen
      await pdf.save();

      // Returnerer vellykket respons med filmetadata
      res.status(200).json({ message: 'File uploaded successfully!', pdf });
    } catch (error) {
      // Feilhåndtering for databaseoperasjoner
      console.error('Error saving PDF metadata:', error);
      res.status(500).json({ error: 'Failed to save PDF metadata.' });
    }
  });
});

// Eksporterer ruteren for bruk i hovedapplikasjonen
module.exports = router;