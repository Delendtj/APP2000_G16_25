const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
  holeId: { type: Number, required: true },  
  holeNumber: { type: Number, required: true }, 
  courseId: { type: Number, required: true }, 
  par: { type: Number, required: true }, 
  distance: { type: Number, required: true },
  description: { type: String }, 
  outOfBounds: { type: Number, default: 0 }, 

  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  }
}, { collection: 'holes' }); 

module.exports = mongoose.model('Hole', holeSchema);
