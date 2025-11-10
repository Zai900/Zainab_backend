import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /orders -> create order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
