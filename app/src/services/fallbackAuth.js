/**
 * Fallback authentication service for handling auth edge cases
 * This service provides robust login capabilities with multiple fallback mechanisms
 */

import axios from 'axios';
import { mockLogin, mockSignup } from './mockAuthService';
import apiConfig from './apiConfig';

// Check if the backend is down by making a ping request
export const isBackendDown = async () => {
  try {
    // Check the Render backend first if we're on Netlify
    if (apiConfig.isNetlify || apiConfig.isVercel) {
      console.log('Checking Render backend availability from Netlify/Vercel...');
      try {
        const url = `${apiConfig.RENDER_BACKEND}/health`;
        console.log(`Trying to connect to Render backend at: ${url}`);

        const response = await axios.get(url, {
          timeout: 8000, // Longer timeout for production
          headers: apiConfig.defaultHeaders,
          // Important: Don't throw error on bad status codes
          validateStatus: (status) => true,
        });

        console.log(`Response from Render health check:`, {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });

        if (response.status === 200) {
          console.log('Render backend is up and healthy!');
          return false; // Backend is up
        }
      } catch (renderError) {
        console.warn(`Failed to connect to Render backend:`, renderError.message);
      }
    }

    // Check if we're in local development
    if (apiConfig.isLocalDev) {
      console.log('Detected local development environment');
      console.log('Local backend URL:', apiConfig.API_BASE_URL);

      // Try multiple local endpoints to check if backend is running
      const localEndpointsToTry = ['/health', '/', '/api', '/auth/status', '/status'];

      for (const endpoint of localEndpointsToTry) {
        try {
          const url = `${apiConfig.API_BASE_URL}${endpoint}`;
          console.log(`Trying to connect to local backend at: ${url}`);

          const response = await axios.get(url, {
            timeout: 5000,
            headers: apiConfig.defaultHeaders,
            // Important: Don't throw error on bad status codes
            validateStatus: (status) => true,
          });

          console.log(`Response from ${url}:`, {
            status: response.status,
            statusText: response.statusText,
            data: response.data ? 'Data received' : 'No data',
          });

          // Even a 404 means the server is up - we just got the wrong endpoint
          if (response.status) {
            console.log('Local backend is up! (Returned status code:', response.status, ')');
            return false; // Local backend is up
          }
        } catch (endpointError) {
          console.warn(`Failed to connect to ${endpoint}:`, endpointError.message);
        }
      }

      console.warn('All local backend endpoints failed');

      // If nothing worked, try direct connection without path
      try {
        console.log('Trying direct connection to local backend host...');
        const response = await axios.get(apiConfig.API_BASE_URL, {
          timeout: 5000,
          validateStatus: (status) => true,
        });

        if (response) {
          console.log('Local backend host is reachable!');
          return false; // The host is reachable
        }
      } catch (hostError) {
        console.error('Local backend host unreachable:', hostError.message);
      }
    }

    // Fall back to using mock authentication
    console.warn('Activating offline mode - no backend available');
    return true;
  } catch (error) {
    console.error('Backend checking error:', error.message);
    return true; // Backend is down or unreachable
  }
};

/**
 * Attempts to login using multiple approaches if one fails
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response with token and user data
 */
export const robustLogin = async (email, password) => {
  console.log('Starting robust login attempt for:', email);

  // First check if backend is completely down
  const backendDown = await isBackendDown();
  if (backendDown) {
    console.log('Backend is down - using mock authentication');
    return await mockLogin(email, password);
  } else {
    console.log('Backend is up and available - using real authentication');
  }

  // Define multiple authentication approaches
  const approaches = [];

  // Always add the direct Render backend check first when on Netlify or Vercel
  if (apiConfig.isNetlify || apiConfig.isVercel) {
    approaches.unshift({
      name: 'Direct Render backend with explicit URL',
      url: `${apiConfig.RENDER_BACKEND}/auth/login`,
      method: async () => {
        console.log(`Attempting direct login to: ${apiConfig.RENDER_BACKEND}/auth/login`);
        return await axios.post(
          `${apiConfig.RENDER_BACKEND}/auth/login`,
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    });
  }

  // Add local backend approach if in development mode
  if (apiConfig.isLocalDev) {
    approaches.push({
      name: 'Local development backend',
      url: `${apiConfig.API_BASE_URL}/auth/login`,
      method: async () => {
        return await axios.post(
          `${apiConfig.API_BASE_URL}/auth/login`,
          { email, password },
          {
            headers: apiConfig.defaultHeaders,
            withCredentials: true,
          },
        );
      },
    });
  }

  // Add standard approaches
  approaches.push(
    // Approach 1: Direct Render backend
    {
      name: 'Direct Render backend',
      url: 'https://fitvice-oad4.onrender.com/auth/login',
      method: async () => {
        return await axios.post(
          'https://fitvice-oad4.onrender.com/auth/login',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },

    // Approach 2: Netlify proxy
    {
      name: 'Netlify API proxy',
      url: '/api/auth/login',
      method: async () => {
        return await axios.post(
          '/api/auth/login',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },

    // Approach 3: Netlify function direct
    {
      name: 'Netlify function',
      url: '/.netlify/functions/api/auth/login',
      method: async () => {
        return await axios.post(
          '/.netlify/functions/api/auth/login',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },
  );

  let lastError = null;

  // Try each approach in sequence
  for (const approach of approaches) {
    try {
      console.log(`Trying login approach: ${approach.name} (${approach.url})`);

      const response = await approach.method();

      console.log(`${approach.name} login response:`, {
        status: response.status,
        success: response.data?.success,
        hasToken: !!response.data?.token,
      });

      // If successful, return the response data
      if (response.data?.success && response.data?.token) {
        console.log(`Login successful via ${approach.name}`);
        return response.data;
      }

      // Non-error response but missing success/token
      console.warn(`${approach.name} login response didn't contain expected data:`, response.data);
      lastError = new Error(response.data?.message || `Authentication failed via ${approach.name}`);
    } catch (error) {
      console.warn(`${approach.name} login attempt failed:`, error.message);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
      }
      lastError = error;
      // Continue to next approach
    }
  }

  // If all approaches failed, try mock authentication as a final fallback
  console.log('All regular approaches failed - falling back to mock authentication');
  return await mockLogin(email, password);
};

/**
 * Attempts to signup using multiple approaches if one fails
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - User name
 * @returns {Promise<Object>} Authentication response with token and user data
 */
export const robustSignup = async (email, password, username) => {
  console.log('Starting robust signup attempt for:', email);

  // First check if backend is completely down
  const backendDown = await isBackendDown();
  if (backendDown) {
    console.log('Backend is down - using mock authentication for signup');
    return await mockSignup(email, password, username);
  }

  // Define multiple authentication approaches
  const approaches = [];

  // Add local backend approach if in development mode
  if (apiConfig.isLocalDev) {
    approaches.push({
      name: 'Local development backend',
      url: `${apiConfig.API_BASE_URL}/auth/signup`,
      method: async () => {
        return await axios.post(
          `${apiConfig.API_BASE_URL}/auth/signup`,
          { email, password, username },
          {
            headers: apiConfig.defaultHeaders,
            withCredentials: true,
          },
        );
      },
    });
  }

  // Add standard approaches
  approaches.push(
    // Approach 1: Direct Render backend
    {
      name: 'Direct Render backend',
      url: 'https://fitvice-oad4.onrender.com/auth/signup',
      method: async () => {
        return await axios.post(
          'https://fitvice-oad4.onrender.com/auth/signup',
          { email, password, username },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },

    // Approach 2: Netlify proxy
    {
      name: 'Netlify API proxy',
      url: '/api/auth/signup',
      method: async () => {
        return await axios.post(
          '/api/auth/signup',
          { email, password, username },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },

    // Approach 3: Netlify function direct
    {
      name: 'Netlify function',
      url: '/.netlify/functions/api/auth/signup',
      method: async () => {
        return await axios.post(
          '/.netlify/functions/api/auth/signup',
          { email, password, username },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      },
    },
  );

  let lastError = null;

  // Try each approach in sequence
  for (const approach of approaches) {
    try {
      console.log(`Trying signup approach: ${approach.name} (${approach.url})`);

      const response = await approach.method();

      console.log(`${approach.name} signup response:`, {
        status: response.status,
        success: response.data?.success,
        hasToken: !!response.data?.token,
      });

      // If successful, return the response data
      if (response.data?.success) {
        console.log(`Signup successful via ${approach.name}`);
        return response.data;
      }

      // Non-error response but missing success/token
      console.warn(`${approach.name} signup response didn't contain expected data:`, response.data);
      lastError = new Error(response.data?.message || `Signup failed via ${approach.name}`);
    } catch (error) {
      console.warn(`${approach.name} signup attempt failed:`, error.message);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
      }
      lastError = error;
      // Continue to next approach
    }
  }

  // If all approaches failed, try mock authentication as a final fallback
  console.log('All regular signup approaches failed - falling back to mock authentication');
  return await mockSignup(email, password, username);
};
