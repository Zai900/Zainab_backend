// server.js — Express + MongoDB backend for After-School Activity Club (ES modules)

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors());                 // enable CORS
app.use(express.json());         // parse JSON body
app.use(morgan("dev"));          // request logging

// ===== Static images (optional) =====
app.use("/static", express.static(path.join(__dirname, "static")));

// ===== Routers =====
app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

<<<<<<< HEAD
// ===== MongoDB =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
=======
// Optional: serve the static folder for direct URLs like /static/Football-Training.jpg
app.use('/static', express.static(path.join(__dirname, 'static')));
>>>>>>> b7266cfe0490c80647a8ec1362c82929dc48ff7a

// ===== Start server (use 4000 to avoid clashes) =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
