// routes/orders.js — router version (no gift)

import express from "express";
import { getOrdersCollection } from "../db.js";

const router = express.Router();

// POST /orders — save a new order
router.post("/", async (req, res) => {
  try {
    const { name, phone, city, items } = req.body;

    // validation
    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const ordersCol = getOrdersCollection();

    const orderDoc = {
      name,
      phone,
      city: city || "",
      items,           // [{ lessonId, quantity }]
      createdAt: new Date(),
    };

    const result = await ordersCol.insertOne(orderDoc);

    res.status(201).json({
      message: "Order created",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

export default router;
