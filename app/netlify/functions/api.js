const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('../../backend/routes/auth');
const recipeRoutes = require('../../backend/routes/recipes');

const app = express();

// Minimal CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://fitvice.netlify.app' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB with minimal options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/recipes', recipeRoutes);

// Simplified error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!'
  });
});

module.exports.handler = serverless(app); 