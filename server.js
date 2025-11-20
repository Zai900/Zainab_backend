// server.js — Express server using native MongoDB driver

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";
import { connectToDb } from "./db.js";

dotenv.config();

const app = express();

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static images (if you want to serve them from /static)
app.use("/static", express.static(path.join(__dirname, "static")));

// ===== Routes =====
app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ===== Start Server after DB connection =====
const PORT = process.env.PORT || 4000;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
