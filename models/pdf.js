const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the PDF
  url: { type: String, required: true }, // URL to access the PDF
  clubId: { type: String, required: true }, // Associated club ID
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
},{collection: 'pdfs'});

module.exports = mongoose.model('PDF', pdfSchema);
