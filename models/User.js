const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//DL
const UserSchema = new mongoose.Schema({
        email: { 
        type: String,
        unique: true, 
        required: [true, "Epost er nødvendig"],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Epost er ugyldig"],},  //Match fra chatgpt 

  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true }, 
  passwordHash : {type: String, required: true},
  membershipStatus: {type:String, default:"free"},
  joinDate: {type:Date, default: Date.now}
});

UserSchema.pre("save", async function next() {
  if (this.isModified("passwordHash")|| this.isNew){
    const salt =await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  }
next()
  });

module.exports = mongoose.model('Users', UserSchema);
