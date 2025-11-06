const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  phone:  { type: String, required: true },
  // Array of lesson IDs (1+ lessons per order)
  lessonIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }],
  // total number of spaces booked across all lessons
  numberOfSpace: { type: Number, required: true, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
