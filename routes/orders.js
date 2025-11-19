import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET /orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find().populate("cart.lessonId");
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /orders
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
        