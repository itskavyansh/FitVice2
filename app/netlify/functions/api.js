const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('../../backend/routes/auth');
const recipeRoutes = require('../../backend/routes/recipes');
require('dotenv').config();

const app = express();

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fitvice.netlify.app';
const MONGODB_URI = process.env.MONGODB_URI || 'https://localhost:3001';

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
}

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry after 5 seconds
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Routes
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/recipes', recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Netlify Functions handler
exports.handler = async (event, context) => {
  console.log('API function called with path:', event.path);
  
  try {
    return serverless(app)(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: 'Internal server error'
      })
    };
  }
}; 