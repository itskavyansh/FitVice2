require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const jarvisRoutes = require('./routes/jarvis');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Incoming request origin:', origin);

      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: allowing all origins');
        return callback(null, true);
      }

      const allowedOrigins = [
        'https://fitvice.netlify.app',
        'https://fitvice2.netlify.app',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean); // Remove any undefined values

      console.log('Allowed origins:', allowedOrigins);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin provided, allowing request');
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.error('CORS blocked request from:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  }),
);
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : '[omitted]',
  });
  next();
});

// Connect to MongoDB
const connectWithRetry = () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be set in production');
    }
    return;
  }

  console.log('Attempting to connect to MongoDB...');
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    })
    .then(() => {
      console.log('Connected to MongoDB successfully');
      // Test the connection by trying to find a user
      return mongoose.connection.db.admin().ping();
    })
    .then(() => {
      console.log('MongoDB connection verified with ping');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      if (process.env.NODE_ENV === 'production') {
        console.error('Production environment detected, will retry connection...');
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('Development environment detected, check MongoDB connection string');
      }
    });
};

// Start MongoDB connection
connectWithRetry();

// Routes - Mount under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/jarvis', jarvisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});
