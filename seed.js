// seed.js — seed lessons using native MongoDB driver (no mongoose)
import dotenv from "dotenv";
import { connectToDb } from "./db.js";

dotenv.config(); // loads .env -> process.env

const seedData = [
  { subject: "Football Training",  location: "Sports Hall A",   price: 15, spaces: 5, image: "football.jpg" },
  { subject: "Tennis Coaching",    location: "Court 2",         price: 12, spaces: 5, image: "tennis.jpg" },
  { subject: "Volleyball Practice",location: "Gym Court 1",     price: 10, spaces: 5, image: "volleyball.jpg" },
  { subject: "Basketball Skills",  location: "Sports Hall B",   price: 14, spaces: 5, image: "basketball.jpg" },
  { subject: "Swimming Basics",    location: "Pool Complex",    price: 18, spaces: 5, image: "swimming-basics.jpg" },
  { subject: "Table Tennis Club",  location: "Activity Room 3", price: 8,  spaces: 5, image: "table-tennis-club.jpg" },
  { subject: "Badminton Coaching", location: "Sports Hall C",   price: 11, spaces: 5, image: "badminton.jpg" },
  { subject: "Yoga & Stretch",     location: "Studio 2",        price: 7,  spaces: 5, image: "yoga-stretch.jpg" },
  { subject: "Coding for Kids",    location: "IT Lab",          price: 20, spaces: 5, image: "coding-for-kids.jpg" },
  { subject: "Dance Fitness",      location: "Studio 1",        price: 9,  spaces: 5, image: "dance-fitness.jpg" }
];

(async () => {
  try {
    const db = await connectToDb();              // use native driver connection
    const lessonsCol = db.collection("lessons");

    await lessonsCol.deleteMany({});             // clear old data
    await lessonsCol.insertMany(seedData);       // insert new data

    console.log("✅ Seed complete (native MongoDB driver)");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exitCode = 1;
  } finally {
    // with the pooled client, we don't strictly need to close here;
    // script will exit when done
    process.exit();
  }
})();
