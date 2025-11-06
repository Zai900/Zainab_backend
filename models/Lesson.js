const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  topic:     { type: String, required: true },     // e.g. "Football Training"
  price:     { type: Number, required: true, min: 0 },
  location:  { type: String, required: true },
  space:     { type: Number, required: true, min: 0 },
  image:     { type: String }  // optional: "football.jpg"
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);
