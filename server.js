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

import ordersRouter from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 5000;

// needed for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(
    `[${now}] ${req.method} ${req.url} | body: ${JSON.stringify(req.body)}`
  );
  next();
});

// use orders router for /orders
app.use("/orders", ordersRouter);

// static image middleware (serves files from /static)
app.get("/lesson-images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "static", imageName);

  fs.access(imagePath, fs.constants.F_O K, (err) => {
    if (err) {
      console.error("Image not found:", imagePath);
      return res.status(404).json({ error: "Image not found" });
    }
    res.sendFile(imagePath);
  });
});

// ---------- ROUTES ----------

// GET /lessons — return all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessonsCol = getLessonsCollection();
    const lessons = await lessonsCol.find({}).toArray();
    res.json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// PUT /lessons/:id — update any fields (used for spaces)
app.put("/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Invalid lesson ID" });
    }

    const updateFields = req.body;
    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const lessonsCol = getLessonsCollection();

    const result = await lessonsCol.updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const updatedLesson = await lessonsCol.findOne({
      _id: new ObjectId(lessonId),
    });

    res.json(updatedLesson);
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(500).json({ error: "Failed to update lesson" });
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
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
