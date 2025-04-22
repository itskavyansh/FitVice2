/**
 * Central configuration for API URLs and settings.
 * This helps unify API access across different environments.
 */

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get the current hostname to determine the environment
const currentHostname = window.location.hostname;
const currentPort = window.location.port;

// Configure API base URLs with multiple fallback options
const isNetlify = currentHostname.includes('netlify');
const isLocalDev = currentHostname === 'localhost' || currentHostname === '127.0.0.1';

const RENDER_BACKEND = 'https://fitvice-oad4.onrender.com';
const BACKUP_RENDER_BACKEND = 'https://fitvice-backup.onrender.com'; // Backup Render instance if exists
const NETLIFY_FUNCTION_BACKEND = 'https://fitvice.netlify.app/.netlify/functions/api';
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

// Alternative endpoints for fallback - ordered by preference
const BACKUP_ENDPOINTS = [
  RENDER_BACKEND,
  BACKUP_RENDER_BACKEND,
  NETLIFY_FUNCTION_BACKEND
].filter(endpoint => endpoint !== API_BASE_URL && endpoint);

// Configure headers based on environment
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Return the complete API configuration for use in services
export function getApiConfig() {
  return {
    apiBaseUrl: API_BASE_URL,
    renderBaseUrl: RENDER_BACKEND,
    backupRenderBaseUrl: BACKUP_RENDER_BACKEND,
    netlifyBaseUrl: NETLIFY_FUNCTION_BACKEND,
    localBaseUrl: LOCAL_BACKEND,
    backupEndpoints: BACKUP_ENDPOINTS,
    isProduction,
    isNetlify,
    isLocalDev,
    defaultHeaders: headers,
    timeout: 15000, // 15 seconds default timeout
    retryAttempts: 2, // Default retry attempts
    healthEndpoint: '/health',
  };
}

// Export configuration
export default {
  API_BASE_URL,
  AUTH_ENDPOINT: `${API_BASE_URL}/auth`,
  USERS_ENDPOINT: `${API_BASE_URL}/users`,
  RECIPES_ENDPOINT: `${API_BASE_URL}/recipes`,
  JARVIS_ENDPOINT: `${API_BASE_URL}/jarvis`,
  WORKOUTS_ENDPOINT: `${API_BASE_URL}/workouts`,
  BACKUP_ENDPOINTS,
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