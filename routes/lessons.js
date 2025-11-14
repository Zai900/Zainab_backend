// routes/lessons.js
import express from "express";
import Lesson from "../models/Lesson.js";

const router = express.Router();

// GET /lessons  -> list all lessons
router.get("/", async (req, res, next) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

// (optional) GET /lessons/:id -> single lesson
router.get("/:id", async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (err) {
    next(err);
  }
});

// PUT /lessons/:id  -> update a lesson (e.g. spaces)
router.put("/:id", async (req, res, next) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(updatedLesson);
  } catch (err) {
    next(err);
  }
});

export default router;
