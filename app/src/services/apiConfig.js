/**
 * Central configuration for API URLs and settings.
 * This helps unify API access across different environments.
 */

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get the current hostname to determine the environment
const currentHostname = window.location.hostname;

// Configure API base URLs for different environments
let API_BASE_URL = '/api'; // Default for both environments - uses proxy

// Export configuration
export default {
  API_BASE_URL,
  AUTH_ENDPOINT: `${API_BASE_URL}/auth`,
  RECIPES_ENDPOINT: `${API_BASE_URL}/recipes`,
  JARVIS_ENDPOINT: `${API_BASE_URL}/jarvis`,
  WORKOUTS_ENDPOINT: `${API_BASE_URL}/workouts`,
  isProduction,
  
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