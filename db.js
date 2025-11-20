// db.js — MongoDB native driver connection

import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in .env");
}

const client = new MongoClient(uri);
let db;

/**
 * Connect once and reuse the same DB instance.
 */
export async function connectToDb() {
  if (db) return db;

  await client.connect();
  db = client.db(); // uses DB name from connection string
  console.log("✅ Connected to MongoDB Atlas (native driver)");
  return db;
}

/**
 * Get the already-initialized DB instance.
 */
export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb() first.");
  }
  return db;
}
