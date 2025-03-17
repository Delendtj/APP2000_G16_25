const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//DL / Claude
// Define the Counter schema and model
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

// Define the User schema and model
const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  email: { 
    type: String,
    unique: true, 
    required: [true, "Epost er nødvendig"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Epost er ugyldig"],
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  membershipStatus: { type: String, default: "free" },
  joinDate: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }

  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq;
  }

  next();
});

module.exports = mongoose.model('Users', UserSchema);
