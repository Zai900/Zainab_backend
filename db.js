// db.js — MongoDB native driver connection

import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

let client;
let db;

export async function connectToDb() {
  if (db) return db;

  client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
 db = client.db("test");

  console.log("✅ Connected to MongoDB Atlas (native driver)");
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialised. Call connectToDb() first.");
  }
  return db;
}

export function getLessonsCollection() {
  return getDb().collection("lessons");
}

export function getOrdersCollection() {
  return getDb().collection("orders");
}

export { ObjectId };
