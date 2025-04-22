/**
 * Central configuration for API URLs and settings.
 * This helps unify API access across different environments.
 */

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get the current hostname to determine the environment
const currentHostname = window.location.hostname;
const currentPort = window.location.port;

// Configure API base URLs - use direct Render URL for production
const isNetlify = currentHostname.includes('netlify');
const isLocalDev = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
const RENDER_BACKEND = 'https://fitvice-oad4.onrender.com';
const LOCAL_BACKEND = 'http://localhost:3001';

// Choose the appropriate API base URL
let API_BASE_URL;
if (isNetlify) {
  API_BASE_URL = RENDER_BACKEND;
} else if (isLocalDev) {
  API_BASE_URL = LOCAL_BACKEND;
} else {
  API_BASE_URL = '/api';
}

// Configure headers based on environment
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Don't add CORS headers from the frontend - these should come from the backend

// Export configuration
export default {
  API_BASE_URL,
  AUTH_ENDPOINT: `${API_BASE_URL}/auth`,
  RECIPES_ENDPOINT: `${API_BASE_URL}/recipes`,
  JARVIS_ENDPOINT: `${API_BASE_URL}/jarvis`,
  WORKOUTS_ENDPOINT: `${API_BASE_URL}/workouts`,
  isProduction,
  isNetlify,
  isLocalDev,
  
  // Helper function to build full API URLs
  buildUrl: (endpoint) => `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
  
  // Default headers for API requests
  defaultHeaders: headers,
  
  // CORS configuration - for axios requests
  corsConfig: {
    // Don't send credentials for local development to avoid preflight complexity
    credentials: isLocalDev ? false : true,
    withCredentials: isLocalDev ? false : true
  }
}; 