// seed.js — ESM only
import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "./models/Lesson.js";

dotenv.config(); // loads .env -> process.env

const seedData = [
  { topic: "Football Training",  location: "Sports Hall A", price: 15, spaces: 5, image: "football.jpg" },
  { topic: "Tennis Coaching",    location: "Court 2",       price: 12, spaces: 5, image: "tennis.jpg" },
  { topic: "Volleyball Practice",location: "Gym Court 1",   price: 10, spaces: 5, image: "volleyball.jpg" },
  { topic: "Basketball Skills",  location: "Sports Hall B", price: 14, spaces: 5, image: "basketball.jpg" },
  { topic: "Swimming Basics",    location: "Pool Complex",        price: 18, spaces: 5, image: "swimming-basics.jpg" },
  { topic: "Table Tennis Club",  location: "Activity Room 3", price: 8, spaces: 5, image: "table-tennis-club.jpg" },
  { topic: "Badminton Coaching", location: "Sports Hall C", price: 11, spaces: 5, image: "badminton.jpg" },
  { topic: "Yoga &Stretch", location: "Studio 2", price: 7, spaces: 5, image: "yoga-stretch.jpg" },
  { topic: "Coding for Kids", location: "IT Lab", price: 20, spaces: 5, image: "coding-for-kids.jpg" },
  { topic: "Dance Fitness", location: "Studio 1", price: 9, spaces: 5, image: "dance-fitness.jpg" }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Lesson.deleteMany({});
    await Lesson.insertMany(seedData);
    console.log("Seed complete");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
