const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    difficulty: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Number, required: true },
    numberOfHoles: { type: Number, required: true },
    clubId: { type: Number, required: true },
    holes: { type: Array, default: [] },
    reviews: { type: Array, default: [] },
    weathers: { type: Array, default: [] },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  { collection: "courses" }
);

const Course = mongoose.model("courses", courseSchema);
module.exports = Course;
