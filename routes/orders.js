import express from "express";
import { getOrdersCollection } from "../db.js";
import { ObjectId } from "../db.js";

const router = express.Router();

// ========== GET /orders ==========
router.get("/", async (req, res) => {
  try {
    const ordersCol = getOrdersCollection();
    const orders = await ordersCol.find().toArray();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ========== POST /orders ==========
router.post("/", async (req, res) => {
  console.log("POST /orders body:", req.body);

  const { name, phone, city, cart } = req.body;

  // basic validation – this is what controls 400 errors
  if (
    !name ||
    !phone ||
    !city ||
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  // build the document exactly as we want to store it
  const orderDoc = {
    name: String(name).trim(),
    phone: String(phone).trim(),
    city: String(city).trim(),
    cart: cart.map((item) => ({
      lessonId: new ObjectId(item.lessonId),
      quantity: Number(item.quantity) || 1,
    })),
    createdAt: new Date(),
  };

  try {
    const ordersCol = getOrdersCollection();

    const result = await ordersCol.insertOne(orderDoc);

    // send back created order (201 = Created)
    res.status(201).json({
      _id: result.insertedId,
      ...orderDoc,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
