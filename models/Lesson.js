import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema({
  topic: String,
  location: String,
  price: Number,
  spaces: Number
});
export default mongoose.model("Lesson", lessonSchema);
