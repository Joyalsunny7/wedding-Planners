const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./user/routes/orderRoutes');
const inquiryRoutes = require('./user/routes/inquiryRoutes');

require('dotenv').config();
console.log("Checking Env -> User:", process.env.EMAIL_USER, "Pass:", process.env.EMAIL_PASS ? "Loaded (hidden)" : "MISSING");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount auth routes directly without an index.js router
app.use('/api/user/auth', require('./user/routes/authRoutes'));
app.use('/api/user/orders', orderRoutes);
app.use('/api/user/inquiries', inquiryRoutes);
// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wedding_planners';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));