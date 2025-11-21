// server.js — CST3144 Backend
// Express + Native MongoDB Driver + Middleware + REST API

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";
import { connectToDb } from "./db.js";
 
// Load .env
dotenv.config();

const app = express();

// ===== ES Module __dirname fix =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // coursework logger middleware

// ===== Serve static images (coursework requirement) =====
app.use("/images", express.static(path.join(__dirname, "static/images")));


// ===== Routes =====
app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);

// ===== Default home route (good for Render) =====
app.get("/", (req, res) => {
  res.send("Backend running. Try /lessons or /orders");
});

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ===== Start server AFTER DB connection =====
const PORT = process.env.PORT || 5000;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅ Connected to MongoDB Atlas`);
      console.log(`✅ API running on http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
