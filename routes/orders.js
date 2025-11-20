// routes/orders.js — orders routes using native MongoDB

import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

const router = express.Router();

// GET /orders -> list all orders
router.get("/", async (_req, res, next) => {
  try {
    const orders = await getDb().collection("orders").find().toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /orders -> create new order
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, city, cart } = req.body;

    if (!name || !phone || !city || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // convert lessonId strings to ObjectId
    const normalizedCart = cart.map((item) => {
      if (!item.lessonId || !ObjectId.isValid(item.lessonId)) {
        throw new Error("Invalid lessonId in cart");
      }
      return {
        lessonId: new ObjectId(item.lessonId),
        quantity: Number(item.quantity) || 1,
      };
    });

    const orderDoc = {
      name,
      phone,
      city,
      cart: normalizedCart,
      createdAt: new Date(),
    };

    const collection = getDb().collection("orders");
    const result = await collection.insertOne(orderDoc);

    // send back saved order
    res.status(201).json({
      _id: result.insertedId,
      ...orderDoc,
    });
  } catch (err) {
    if (err.message && err.message.includes("lessonId")) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
