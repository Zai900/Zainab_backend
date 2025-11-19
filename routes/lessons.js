// routes/lessons.js — using native MongoDB driver
import express from "express";
import { connectToDb, ObjectId } from "../db.js";

const router = express.Router();

// =============================
// GET /lessons -> list all lessons
// =============================
router.get("/", async (req, res, next) => {
  try {
    const db = await connectToDb();
    const lessons = await db.collection("lessons").find({}).toArray();
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

// =============================
// GET /lessons/:id -> single lesson
// =============================
router.get("/:id", async (req, res, next) => {
  try {
    const db = await connectToDb();
    const id = req.params.id;

    const lesson = await db
      .collection("lessons")
      .findOne({ _id: new ObjectId(id) });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    next(err);
  }
});

// =============================
// PUT /lessons/:id -> update lesson (spaces, price, etc.)
// =============================
router.put("/:id", async (req, res, next) => {
  try {
    const db = await connectToDb();
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: req.body }; // can update ANY fields

    const result = await db.collection("lessons").updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Return updated lesson
    const updatedLesson = await db.collection("lessons").findOne(filter);
    res.json(updatedLesson);
  } catch (err) {
    next(err);
  }
});

export default router;
