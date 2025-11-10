import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "./models/Lesson.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Lesson.countDocuments();
    const sample = await Lesson.findOne();  // optional: peek at 1 record
    console.log(`There are ${count} lessons in the database.`);
    if (sample) console.log("Example lesson:", sample);
  } catch (err) {
    console.error("Could not verify lessons:", err);
  } finally {
    await mongoose.disconnect();
  }
})();
