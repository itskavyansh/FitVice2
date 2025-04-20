/**
 * Fallback authentication service for handling auth edge cases
 * This service provides robust login capabilities with multiple fallback mechanisms
 */

import axios from 'axios';

/**
 * Attempts to login using multiple approaches if one fails
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response with token and user data
 */
export const robustLogin = async (email, password) => {
  console.log('Starting robust login attempt for:', email);
  
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
  
  // All approaches failed
  console.error('All login approaches failed. Last error:', lastError?.message);
  
  // Extract meaningful error message if available
  if (lastError?.response?.data?.message) {
    throw new Error(lastError.response.data.message);
  }
  
  throw new Error('Login failed after multiple attempts. Please try again later.');
}; 