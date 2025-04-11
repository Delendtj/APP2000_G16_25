const mongoose = require('mongoose');
const { collection } = require('./User');
//DL
const membershipSchema = new mongoose.Schema({
  membershipId: { type: Number, required: true },
  userId: { type: Number, required: true }, 
  clubId: { type: Number, required: true },  
  membershipStatus: { type: String, enum: ['active', 'inactive'], required: true },
}, {collection: 'memberships'});

module.exports = mongoose.model('Membership', membershipSchema);
