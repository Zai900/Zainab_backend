// routes/lessons.js
import express from "express";
import { getLessonsCollection, ObjectId } from "../db.js";

const router = express.Router();

// ----------------------
// GET /lessons  (all)
// ----------------------
router.get("/", async (req, res) => {
  try {
    const lessons = getLessonsCollection();
    const data = await lessons.find().toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// GET /lessons/:id
// (works for ObjectId OR string _id)
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const lessons = getLessonsCollection();
    const id = req.params.id;

    let filter;
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    } else {
      filter = { _id: id };
    }

    const lesson = await lessons.findOne(filter);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("Error fetching lesson:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// PUT /lessons/:id
// Update fields (e.g. spaces)
// ----------------------
router.put("/:id", async (req, res) => {
  try {
    const lessons = getLessonsCollection();
    const id = req.params.id;
    const update = req.body; // e.g. { spaces: 3 }

    let filter;
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    } else {
      filter = { _id: id };
    }

    const result = await lessons.updateOne(filter, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
