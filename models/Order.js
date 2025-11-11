import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /orders  -> create order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
