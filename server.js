require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const lessonsRouter = require('./routes/lessons');
const ordersRouter  = require('./routes/orders');

const app = express();

// --- DB ---
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// --- Core middleware ---
app.use(cors());
app.use(express.json());

// A) Logger middleware (explainable in demo)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// B) Static images with error if missing
app.get('/images/:name', (req, res) => {
  const file = path.join(__dirname, 'static', req.params.name);
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'Image not found', file: req.params.name });
  }
  res.sendFile(file);
});

// (Optional) Serve the whole static folder if you want direct URLs like /static/basketball.jpg
app.use('/static', express.static(path.join(__dirname, 'static')));

// --- REST API ---
app.use('/lessons', lessonsRouter);
app.use('/orders', ordersRouter);

// --- Error handler (nice to have) ---
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
