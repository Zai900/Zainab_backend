// server.js — Express + MongoDB native driver

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  connectToDb,
  getLessonsCollection,
  getOrdersCollection,
  ObjectId,
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Needed for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} | body: ${JSON.stringify(
      req.body
    )}`
  );
  next();
});

// Serve static images from /static folder
app.use("/static", express.static(path.join(__dirname, "static")));

// ---------- ROUTES ----------

// GET /lessons - return all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await getLessonsCollection().find({}).toArray();
    res.json(lessons);
  } catch (err) {
    console.error("Error loading lessons:", err);
    res.status(500).json({ error: "Failed to load lessons" });
  }
});

// PUT /lessons/:id - update lesson spaces
app.put("/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;
    let { spaces } = req.body;

    spaces = Number(spaces);

    if (!lessonId || isNaN(spaces)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const result = await getLessonsCollection().findOneAndUpdate(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces: spaces } },
      { returnDocument: "after" }
    );

    res.json(result);
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// POST /orders - create a new order
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, city, items } = req.body;

    if (!name || !phone || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const orderDoc = {
      name,
      phone,
      city: city || "",
      items,
      createdAt: new Date(),
    };

    const result = await getOrdersCollection().insertOne(orderDoc);

    res.status(201).json({
      message: "Order created",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ---------- START SERVER ----------
async function startServer() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
