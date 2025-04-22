/**
 * Central configuration for API URLs and settings.
 * This helps unify API access across different environments with fallback support.
 */

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get the current hostname to determine the environment
const currentHostname = window.location.hostname;
const currentPort = window.location.port;

// Configure API base URLs with fallback options
const isNetlify = currentHostname.includes('netlify');
const isVercel = currentHostname.includes('vercel');
const isLocalDev = currentHostname === 'localhost' || currentHostname === '127.0.0.1';

// Primary and fallback backend URLs
const RENDER_BACKEND = 'https://fitvice-oad4.onrender.com';
const LOCAL_BACKEND = 'http://localhost:3001';
const FALLBACK_BACKENDS = [RENDER_BACKEND, LOCAL_BACKEND];

// Choose the appropriate API base URL
let API_BASE_URL;
if (isNetlify || isVercel) {
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

// Keep track of API availability
let currentBackendIndex = 0;
const markBackendUnavailable = () => {
  if (FALLBACK_BACKENDS.length > 1 && currentBackendIndex < FALLBACK_BACKENDS.length - 1) {
    currentBackendIndex++;
    console.log(`Switching to fallback backend: ${FALLBACK_BACKENDS[currentBackendIndex]}`);
    return FALLBACK_BACKENDS[currentBackendIndex];
  }
  return null; // No more fallbacks available
};

// Get current backend URL
const getCurrentBackendUrl = () => FALLBACK_BACKENDS[currentBackendIndex];

// Reset to primary backend
const resetToMainBackend = () => {
  currentBackendIndex = 0;
  return FALLBACK_BACKENDS[0];
};

// Test backend connectivity
const testBackendConnectivity = async (url) => {
  try {
    console.log(`Testing connectivity to ${url}/health`);
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers,
      timeout: 5000,
    });
    
    const result = await response.text();
    console.log(`Backend ${url} health check result:`, response.status, result);
    
    return response.ok;
  } catch (error) {
    console.warn(`Backend ${url} is not responding:`, error.message);
    return false;
  }
};

// Attempt to connect to each backend until one works
const findWorkingBackend = async () => {
  for (let i = 0; i < FALLBACK_BACKENDS.length; i++) {
    if (await testBackendConnectivity(FALLBACK_BACKENDS[i])) {
      currentBackendIndex = i;
      console.log(`Using backend: ${FALLBACK_BACKENDS[i]}`);
      return FALLBACK_BACKENDS[i];
    }
  }
  // If none work, default to the first one and let the calling code handle the error
  currentBackendIndex = 0;
  return FALLBACK_BACKENDS[0];
};

// Try to find a working backend on load
findWorkingBackend().catch((err) => console.warn('Error finding working backend:', err));

// Dynamically get endpoint URLs based on current backend
const getEndpointUrl = (endpoint) => {
  const baseUrl = getCurrentBackendUrl();
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Export configuration
export default {
  API_BASE_URL,
  get AUTH_ENDPOINT() {
    return getEndpointUrl('auth');
  },
  get RECIPES_ENDPOINT() {
    return getEndpointUrl('recipes');
  },
  get JARVIS_ENDPOINT() {
    return getEndpointUrl('jarvis');
  },
  get WORKOUTS_ENDPOINT() {
    return getEndpointUrl('workouts');
  },
  isProduction,
  isNetlify,
  isVercel,
  isLocalDev,
  // Helper function to build full API URLs
  buildUrl: (endpoint) => getEndpointUrl(endpoint),
  // Backend management functions
  getCurrentBackendUrl,
  markBackendUnavailable,
  resetToMainBackend,
  testBackendConnectivity,
  findWorkingBackend,
  // Default headers for API requests
  defaultHeaders: headers,
  // CORS configuration - for axios requests
  corsConfig: {
    // Don't send credentials for local development to avoid preflight complexity
    credentials: isLocalDev ? false : true,
    withCredentials: isLocalDev ? false : true,
  },
}; 