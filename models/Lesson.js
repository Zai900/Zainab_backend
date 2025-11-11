// routes/lessons.js
import express from "express";
import Lesson from "../models/Lesson.js";

const router = express.Router();

// GET /lessons -> all lessons (sorted by topic)
router.get("/", async (_req, res) => {
  const lessons = await Lesson.find().sort({ topic: 1 });
  res.json(lessons);
});

export default router; 