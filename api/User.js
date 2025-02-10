const mongoose = require('mongoose');
//DL
const UserSchema = new mongoose.Schema({
        email: { type: String,
        unique: true, 
        required: [true, "Epost er nødvendig"],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Epost er ugyldig"],},

  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true }, 
  passwordHash : {type: String, required: true},
});

module.exports = mongoose.model('Users', UserSchema);
