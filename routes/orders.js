// routes/orders.js — native MongoDB driver 
import express from "express";
import { connectToDb, ObjectId } from "../db.js";

const router = express.Router();

// GET /orders
router.get("/", async (req, res, next) => {
  try {
    const db = await connectToDb();
    const orders = await db.collection("orders").find({}).toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /orders
router.post("/", async (req, res) => {
  try {
    const db = await connectToDb();
    const orderData = req.body;

    const result = await db.collection("orders").insertOne(orderData);

    res.status(201).json({
      _id: result.insertedId,
      ...orderData,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
