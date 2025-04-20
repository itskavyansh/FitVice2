/**
 * Central configuration for API URLs and settings.
 * This helps unify API access across different environments.
 */

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get the current hostname to determine the environment
const currentHostname = window.location.hostname;

// Configure API base URLs - use direct Render URL for production
const isNetlify = currentHostname.includes('netlify');
const RENDER_BACKEND = 'https://fitvice-oad4.onrender.com';

// Use direct backend URL on Netlify, relative URL otherwise
let API_BASE_URL = isNetlify ? RENDER_BACKEND : '/api';

// Export configuration
export default {
  API_BASE_URL,
  AUTH_ENDPOINT: `${API_BASE_URL}/auth`,
  RECIPES_ENDPOINT: `${API_BASE_URL}/recipes`,
  JARVIS_ENDPOINT: `${API_BASE_URL}/jarvis`,
  WORKOUTS_ENDPOINT: `${API_BASE_URL}/workouts`,
  isProduction,
  isNetlify,
  
  // Helper function to build full API URLs
  buildUrl: (endpoint) => `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
  
  // Default headers for API requests
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // CORS configuration
  corsConfig: {
    credentials: true,
    withCredentials: true,
  }
}; 