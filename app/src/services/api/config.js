// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    VERIFY: '/auth/verify',
  },
  // Add other API endpoints here as the app grows
};

export { API_BASE_URL, API_ENDPOINTS }; 