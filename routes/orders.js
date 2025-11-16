// routes/orders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET /orders  -> list all orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find().populate("cart.lessonId");
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /orders -> create new order
router.post("/", async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    if (err.name === "ValidationError") {
      // your model validation errors (e.g. empty cart) will come here
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
