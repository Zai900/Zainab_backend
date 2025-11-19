// db.js - MongoDB native driver connection
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // loads .env -> process.env

const uri = process.env.MONGODB_URI;

// One shared client for the whole server
const client = new MongoClient(uri);

let db;

export async function connectToDb() {
  // If already connected, reuse
  if (db) return db;

  // Connect to MongoDB Atlas
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas (native driver)");

  // Use the database from your connection string (e.g. "test")
  db = client.db();
  return db;
}

// Export ObjectId helper for IDs
export { ObjectId };
