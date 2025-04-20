const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    location: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }, 
    courseId : { type: Number, required: true }, 
    clubId: { type: Number, }, 
    userId: { type: Number, }
}, {collection: 'tournaments'}); 

module.exports = mongoose.model('Tournament', tournamentSchema);
