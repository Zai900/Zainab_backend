import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  spaces: { type: Number, required: true },
  image: { type: String },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;