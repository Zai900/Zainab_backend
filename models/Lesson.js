import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },     // e.g. "Football Training"
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    spaces: { type: Number, required: true, min: 0 },
    image: { type: String }                      // optional: "football.jpg"
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
