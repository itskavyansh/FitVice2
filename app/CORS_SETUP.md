# CORS Setup for Local Development

To connect your frontend (localhost:3000) to your backend (localhost:3001), you need to configure CORS on your backend server.

## Using Express.js

If your backend uses Express.js, follow these steps:

1. Install the CORS middleware:
```bash
npm install cors
```

2. Add the middleware to your backend server:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Use CORS middleware with configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Your existing routes and middleware...
```

## Manual CORS Headers

If you're not using Express or need to add CORS headers manually:

```javascript
// Add these headers to each response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
```

## Testing Your CORS Setup

After implementing the CORS configuration:

1. Start your backend server on port 3001
2. Start your frontend on port 3000
3. When you see "Offline Mode Detected" in the login screen, click the "Test Local Backend Connection" button

If everything is configured correctly, you should be able to connect to your backend and use real authentication instead of the offline mode. 