// server.js - Express server using native MongoDB driver (NO mongoose)
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import { fileURLToPath } from "url";

import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";
import { connectToDb } from "./db.js";

dotenv.config();

const app = express();

// path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Core middleware =====
app.use(cors());
app.use(express.json());

// Coursework requires logging for all requests
app.use(morgan("dev"));  // or you can replace with your own logger

// ===== Static images middleware =====
app.get("/images/:fileName", (req, res) => {
  const imagesDir = path.join(__dirname, "static");  // adjust if images are elsewhere
  const filePath = path.join(imagesDir, req.params.fileName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

// ===== Routers =====
app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ===== Start server only AFTER connecting to MongoDB =====
const PORT = process.env.PORT || 4000;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
