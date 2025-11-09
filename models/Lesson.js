import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  spaces: { type: Number, required: true }
});

export default mongoose.model("Lesson", lessonSchema);
