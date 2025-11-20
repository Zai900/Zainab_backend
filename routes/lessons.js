// routes/lessons.js — lessons routes using native MongoDB

import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

const router = express.Router();

// GET /lessons -> list all lessons
router.get("/", async (_req, res, next) => {
  try {
    const lessons = await getDb().collection("lessons").find().toArray();
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

// GET /lessons/:id -> single lesson
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lesson ID" });
    }

    const lesson = await getDb()
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

// PUT /lessons/:id -> update lesson (e.g. spaces after order)
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lesson ID" });
    }

    const updateDoc = { $set: req.body };

    const result = await getDb()
      .collection("lessons")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        updateDoc,
        { returnDocument: "after" }
      );

    if (!result.value) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(result.value);
  } catch (err) {
    next(err);
  }
});

export default router;
