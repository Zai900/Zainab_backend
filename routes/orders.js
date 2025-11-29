// POST /orders - create a new order and update lesson spaces
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, city, items } = req.body;

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const lessonsCol = getLessonsCollection();
    const ordersCol = getOrdersCollection();

    // 1) Check and update spaces for each lesson
    for (const item of items) {
      const { lessonId, quantity } = item;

      if (!lessonId || !quantity) {
        return res.status(400).json({ error: "Invalid item data" });
      }

      const _id = new ObjectId(lessonId);

      const lesson = await lessonsCol.findOne({ _id });
      if (!lesson) {
        return res.status(400).json({ error: "Lesson not found" });
      }
      if (lesson.spaces < quantity) {
        return res
          .status(400)
          .json({ error: `Not enough spaces for ${lesson.subject}` });
      }

      // decrease spaces
      await lessonsCol.updateOne(
        { _id },
        { $inc: { spaces: -quantity } }
      );
    }

    // 2) Save the order
    const orderDoc = {
      name,
      phone,
      city: city || "",
      items,
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
