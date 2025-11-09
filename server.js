// server.js — Express + MongoDB backend for After-School Activity Club

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Routers
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');

const app = express();

// ======== CONNECT TO MONGODB ========
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ======== MIDDLEWARE ========

// enable JSON + CORS
app.use(express.json());
app.use(cors());

// A) Logger middleware (prints every request)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// B) Static file middleware for images
app.get('/images/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'static', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found', file: req.params.filename });
  }
  res.sendFile(filePath);
});

// Optional: serve the static folder for direct URLs like /static/Football-Training.jpg
app.use('/static', express.static(path.join(__dirname, 'static')));

// ======== ROUTES ========
app.use('/lessons', lessonsRouter);
app.use('/orders', ordersRouter);

// ======== ERROR HANDLER ========
app.use((err, req, res, next) => {
  console.error(' Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ======== START SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
