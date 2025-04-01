const mongoose = require('mongoose');

const klubbSchema = new mongoose.Schema({
    name: {type: String,},
    description: {type: String,},
    clubId: {type: Number,unique: true},
    contactPerson: {type: String,},
    contactEmail: {type: String,},
    createdAt: {type: Date}
}, {collection: 'clubs'});
module.exports = mongoose.model('Klubb', klubbSchema);

