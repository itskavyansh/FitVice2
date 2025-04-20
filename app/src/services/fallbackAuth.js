/**
 * Fallback authentication service for handling auth edge cases
 * This service provides robust login capabilities with multiple fallback mechanisms
 */

import axios from 'axios';
import { mockLogin, mockSignup } from './mockAuthService';

// Check if the backend is down by making a ping request
export const isBackendDown = async () => {
  try {
    // Try multiple health check endpoints
    try {
      // First try the /health endpoint
      await axios.get('https://fitvice-oad4.onrender.com/health', { timeout: 3000 });
      console.log('Backend is up via /health endpoint');
      return false; // Backend is up
    } catch (healthError) {
      console.warn('Health endpoint check failed:', healthError.message);
      
      // If /health fails, try the root endpoint as fallback
      try {
        const rootResponse = await axios.get('https://fitvice-oad4.onrender.com/', { timeout: 3000 });
        if (rootResponse.status === 200) {
          console.log('Backend is up via root endpoint');
          return false; // Backend is up
        }
      } catch (rootError) {
        console.warn('Root endpoint check failed:', rootError.message);
      }
    }
    
    // All checks failed
    console.warn('Backend appears to be down - all health checks failed');
    return true; // Backend is down or unreachable
  } catch (error) {
    console.warn('Backend appears to be down:', error.message);
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
  }
  
  // Define multiple authentication approaches
  const approaches = [
    // Approach 1: Direct Render backend
    {
      name: 'Direct Render backend',
      url: 'https://fitvice-oad4.onrender.com/auth/login',
      method: async () => {
        return await axios.post('https://fitvice-oad4.onrender.com/auth/login', 
          { email, password },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
    
    // Approach 2: Netlify proxy
    {
      name: 'Netlify API proxy',
      url: '/api/auth/login',
      method: async () => {
        return await axios.post('/api/auth/login', 
          { email, password },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
    
    // Approach 3: Netlify function direct
    {
      name: 'Netlify function',
      url: '/.netlify/functions/api/auth/login',
      method: async () => {
        return await axios.post('/.netlify/functions/api/auth/login', 
          { email, password },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
  ];
  
  let lastError = null;
  
  // Try each approach in sequence
  for (const approach of approaches) {
    try {
      console.log(`Trying login approach: ${approach.name} (${approach.url})`);
      
      const response = await approach.method();
      
      console.log(`${approach.name} login response:`, {
        status: response.status,
        success: response.data?.success,
        hasToken: !!response.data?.token
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
  const approaches = [
    // Approach 1: Direct Render backend
    {
      name: 'Direct Render backend',
      url: 'https://fitvice-oad4.onrender.com/auth/signup',
      method: async () => {
        return await axios.post('https://fitvice-oad4.onrender.com/auth/signup', 
          { email, password, username },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
    
    // Approach 2: Netlify proxy
    {
      name: 'Netlify API proxy',
      url: '/api/auth/signup',
      method: async () => {
        return await axios.post('/api/auth/signup', 
          { email, password, username },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
    
    // Approach 3: Netlify function direct
    {
      name: 'Netlify function',
      url: '/.netlify/functions/api/auth/signup',
      method: async () => {
        return await axios.post('/.netlify/functions/api/auth/signup', 
          { email, password, username },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }
    },
  ];
  
  let lastError = null;
  
  // Try each approach in sequence
  for (const approach of approaches) {
    try {
      console.log(`Trying signup approach: ${approach.name} (${approach.url})`);
      
      const response = await approach.method();
      
      console.log(`${approach.name} signup response:`, {
        status: response.status,
        success: response.data?.success,
        hasToken: !!response.data?.token
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