import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "./models/Lesson.js";

dotenv.config();

const seedData = [
  { topic: "Football Training",  location: "Sports Hall A", price: 15, spaces: 5 },
  { topic: "Tennis Coaching",    location: "Court 2",       price: 12, spaces: 5 },
  { topic: "Volleyball Practice",location: "Gym Court 1",   price: 10, spaces: 5 },
  { topic: "Basketball Skills",  location: "Sports Hall B", price: 14, spaces: 5 },
  { topic: "Swimming Lessons",   location: "Pool 1",        price: 20, spaces: 5 },
  { topic: "Art Workshop",       location: "Room 5A",       price: 8,  spaces: 5 },
  { topic: "Coding for Kids",    location: "Computer Lab",  price: 18, spaces: 5 },
  { topic: "Dance Fitness",      location: "Studio 2",      price: 13, spaces: 5 },
  { topic: "Music Club",         location: "Music Room",    price: 11, spaces: 5 },
  { topic: "Karate Training",    location: "Dojo 1",        price: 16, spaces: 5 }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Lesson.deleteMany({});
    await Lesson.insertMany(seedData);
    console.log("Seed complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
