// routes/lessons.js
import { Router } from "express";
import { getLessonsCollection, ObjectId } from "../db.js";

const router = Router();

// GET /lessons  — list all lessons
router.get("/", async (_req, res, next) => {
  try {
    const lessons = await getLessonsCollection().find({}).toArray();
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

// GET /lessons/:id — single lesson by id
router.get("/:id", async (req, res, next) => {
  try {
    const lessonId = req.params.id;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Invalid lesson id" });
    }

    const lesson = await getLessonsCollection().findOne({
      _id: new ObjectId(lessonId),
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    next(err);
  }
});

// PUT /lessons/:id — update spaces
router.put("/:id", async (req, res, next) => {
  try {
    const lessonId = req.params.id;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Invalid lesson id" });
    }

    // Accept { spaces: 3 } OR { change: -1 }
    const { spaces, change } = req.body;

    const filter = { _id: new ObjectId(lessonId) };
    let update;

    if (typeof change === "number") {
      update = { $inc: { spaces: change } };
    } else if (typeof spaces === "number") {
      update = { $set: { spaces } };
    } else {
      return res
        .status(400)
        .json({ error: "Provide 'spaces' (number) or 'change' (number)" });
    }

    const result = await getLessonsCollection().findOneAndUpdate(
      filter,
      update,
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    return res.json({
      message: "Lesson updated successfully",
      updatedLesson: result.value,
    });
  } catch (err) {
    console.error("PUT /lessons error:", err);
    next(err);
  }
});

export default router;
