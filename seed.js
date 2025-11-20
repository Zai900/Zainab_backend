// seed.js — seed MongoDB with initial lessons (native driver)

import dotenv from "dotenv";
import { connectToDb, getDb } from "./db.js";

dotenv.config();

const seedData = [
  { subject: "Football Training",   location: "Sports Hall A",   price: 15, spaces: 5, image: "football.jpg" },
  { subject: "Tennis Coaching",     location: "Court 2",         price: 12, spaces: 5, image: "tennis.jpg" },
  { subject: "Volleyball Practice", location: "Gym Court 1",     price: 10, spaces: 5, image: "volleyball.jpg" },
  { subject: "Basketball Skills",   location: "Sports Hall B",   price: 14, spaces: 5, image: "basketball.jpg" },
  { subject: "Swimming Basics",     location: "Pool Complex",    price: 18, spaces: 5, image: "swimming-basics.jpg" },
  { subject: "Table Tennis Club",   location: "Activity Room 3", price: 8,  spaces: 5, image: "table-tennis-club.jpg" },
  { subject: "Badminton Coaching",  location: "Sports Hall C",   price: 11, spaces: 5, image: "badminton.jpg" },
  { subject: "Yoga & Stretch",      location: "Studio 2",        price: 7,  spaces: 5, image: "yoga-stretch.jpg" },
  { subject: "Coding for Kids",     location: "IT Lab",          price: 20, spaces: 5, image: "coding-for-kids.jpg" },
  { subject: "Dance Fitness",       location: "Studio 1",        price: 9,  spaces: 5, image: "dance-fitness.jpg" },
];

(async () => {
  try {
    await connectToDb();
    const db = getDb();
    const lessonsCol = db.collection("lessons");

    await lessonsCol.deleteMany({});
    await lessonsCol.insertMany(seedData);

    console.log("✅ Seed complete (native MongoDB driver)");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();
