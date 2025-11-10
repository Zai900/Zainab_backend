import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },             // Customer name
    phoneNumber: { type: String, required: true },      // Customer phone number
    lessonIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Related lessons
    spaces: { type: Number, required: true, min: 1 }    // Number of spaces booked
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
