// routes/orders.js

import { Router } from "express";
import {
  getOrdersCollection,
  getLessonsCollection,
  ObjectId,
} from "../db.js";

const router = Router();

// Simple validation helper
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// GET /orders — list all orders
router.get("/", async (_req, res, next) => {
  try {
    const orders = await getOrdersCollection().find({}).toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /orders — create new order
// Expected JSON:
// {
//   "name": "Zainab",
//   "phone": "123456789",
//   "lessonID": "673d2bd1c1874bf65e64f403",
//   "numberOfSpaces": 1
// }
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, lessonID, numberOfSpaces } = req.body;

    // Basic validation
    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(phone) ||
      !isNonEmptyString(lessonID) ||
      typeof numberOfSpaces !== "number" ||
      numberOfSpaces <= 0
    ) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    if (!ObjectId.isValid(lessonID)) {
      return res.status(400).json({ error: "Invalid lessonID" });
    }

    const lessonsCol = getLessonsCollection();
    const ordersCol = getOrdersCollection();

    const lessonObjectId = new ObjectId(lessonID);

    // Check lesson exists
    const lesson = await lessonsCol.findOne({ _id: lessonObjectId });
    if (!lesson) {
      return res.status(400).json({ error: "Lesson not found" });
    }

    // Check available spaces
    if (lesson.spaces < numberOfSpaces) {
      return res.status(400).json({ error: "Not enough spaces available" });
    }

    // Create order document
    const orderDoc = {
      name: name.trim(),
      phone: phone.trim(),
      lessonID: lessonObjectId,
      numberOfSpaces,
      createdAt: new Date(),
    };

    const insertResult = await ordersCol.insertOne(orderDoc);

    // Decrement spaces on lesson
    await lessonsCol.updateOne(
      { _id: lessonObjectId },
      { $inc: { spaces: -numberOfSpaces } }
    );

    res.status(201).json({
      message: "Order created",
      orderId: insertResult.insertedId,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /orders/:id — simple update (name, phone, numberOfSpaces only)
router.put("/:id", async (req, res, next) => {
  try {
    const orderId = req.params.id;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const { name, phone, numberOfSpaces } = req.body;

    const updateFields = {};
    if (isNonEmptyString(name)) updateFields.name = name.trim();
    if (isNonEmptyString(phone)) updateFields.phone = phone.trim();
    if (typeof numberOfSpaces === "number" && numberOfSpaces > 0) {
      updateFields.numberOfSpaces = numberOfSpaces;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided to update" });
    }

    const result = await getOrdersCollection().findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order updated",
      order: result.value,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
