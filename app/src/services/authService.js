import axios from 'axios';
import apiConfig from './apiConfig';
import { robustLogin } from './fallbackAuth';

// Create axios instance with default config
const api = axios.create({
  baseURL: apiConfig.API_BASE_URL,
  ...apiConfig.corsConfig,
  headers: apiConfig.defaultHeaders,
});

// Add request interceptor for setting auth token and logging
api.interceptors.request.use(
  (config) => {
    // Log the full URL for debugging
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request headers:', config.headers);

    // Always check for token and set header from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure CORS credentials are included
    config.withCredentials = true;

    // Log the request with masked token for security
    const authHeader = config.headers.Authorization;
    const maskedHeader = authHeader
      ? `Bearer ${authHeader.split(' ')[1]?.substring(0, 5)}...`
      : 'None';

    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data ? JSON.stringify(config.data) : '(no data)',
      auth: maskedHeader,
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

const authService = {
  login: async (email, password) => {
    try {
      // Use the robust login function that tries multiple approaches
      const result = await robustLogin(email, password);
      
      // Handle the successful result
      if (result && result.token) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);

        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;

        console.log('Login successful for:', email);
        return result;
      }
      
      // If mock authentication returns a response with success: false,
      // return it instead of throwing an error
      if (result && result.success === false) {
        console.log('Login unsuccessful but handled:', result.message);
        return result;
      }
      
      throw new Error('Invalid response from authentication service');
    } catch (error) {
      console.error('Login error:', error);
      throw error; // The robust login already formats error messages
    }
  },

  signup: async (userData) => {
    try {
      console.log('Attempting signup for:', userData.email);
      // Uses relative path: /api/auth/signup
      const response = await api.post('/auth/signup', userData);

      if (response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        console.log('Signup successful for:', userData.email);
        return response.data;
      }
      console.error('Signup failed - invalid response:', response.data);
      throw new Error(response.data.message || 'Signup failed. Please try again.');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Signup failed. Please try again.');
    }
  },

  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];

    console.log('User logged out');
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }

      console.log('Fetching current user with token:', token.substring(0, 15) + '...');

      // Always ensure the Authorization header is properly set
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('Auth header set for getCurrentUser');

      try {
        // First try to get the me endpoint to validate the token
        // Uses relative path: /api/auth/me
        const response = await api.get('/auth/me');

        console.log('Current user API response:', {
          status: response.status,
          success: response.data.success,
          hasUserData: !!response.data.user,
        });

        if (response.data.success && response.data.user) {
          console.log('Current user fetched successfully');
          return response.data.user;
        }

        console.log('User data not found in response');
        return null;
      } catch (apiError) {
        console.error('API call error in getCurrentUser:', {
          status: apiError.response?.status,
          message: apiError.message,
        });

        // If token is invalid or expired
        if (apiError.response?.status === 401) {
          console.log('Token is invalid/expired - removing from localStorage');
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }

        return null;
      }
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error);
      return null;
    }
  },

  uploadProfilePicture: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      console.log('Uploading profile picture');
      // Uses relative path: /api/auth/profile/picture
      const response = await api.post('/auth/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('Profile picture uploaded successfully');
        return response.data;
      }
      throw new Error('Failed to upload profile picture');
    } catch (error) {
      console.error('Upload profile picture error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload profile picture');
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      console.log('Fetching profile');
      // Uses relative path: /api/auth/profile
      const response = await api.get('/auth/profile');

      if (response.data.success) {
        console.log('Profile fetched successfully');
        return response.data.user;
      }
      throw new Error('Failed to fetch profile');
    } catch (error) {
      console.error('Get profile error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch profile');
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      console.log('Updating profile');
      // Uses relative path: /api/auth/profile
      const response = await api.put('/auth/profile', profileData);

      if (response.data.success) {
        console.log('Profile updated successfully');
        return response.data;
      }
      console.error('Profile update failed - invalid response:', response.data);
      throw new Error('Profile update failed');
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Profile update failed');
    }
  },

  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for verification');
        return false;
      }

      console.log('Verifying token');
      // Uses relative path: /api/auth/verify
      const response = await api.get('/auth/verify');

      const isValid = response.data.success && response.data.valid;
      console.log('Token verification result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Verify token error:', error);
      localStorage.removeItem('token');
      return false;
    }
  },

  // Add a setup function to initialize the auth header
  setupAuthHeaderForServiceCalls: () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Auth header setup from stored token:', token.substring(0, 15) + '...');
      console.log('Headers after setup:', api.defaults.headers.common['Authorization']);
      return true;
    }
    console.log('No token found for auth header setup');
    return false;
  },

  // Initialize the auth system when app starts
  initializeAuth: async () => {
    console.log('Initializing authentication system...');
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No saved token found during initialization');
      return { authenticated: false };
    }

    try {
      // Set the auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Set auth header for initialization');

      // Try to verify the token by fetching the user
      // Uses relative path: /api/auth/verify
      const response = await api.get('/auth/verify');

      if (response.data.success && response.data.valid) {
        console.log('Token verified during initialization:', response.data.user?.email);
        return {
          authenticated: true,
          user: response.data.user,
        };
      } else {
        console.log('Token invalid during verification');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        return { authenticated: false };
      }
    } catch (error) {
      console.error('Auth initialization error:', error.message);
      // If verification fails, clean up
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return { authenticated: false };
    }
  },

  loginWithGoogle: async () => {
    try {
      // Redirect to Google OAuth - Uses relative path
      window.location.href = `${apiConfig.API_BASE_URL}/auth/google`;
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again.');
    }
  },

  loginWithGithub: async () => {
    try {
      // Redirect to GitHub OAuth - Uses relative path
      window.location.href = `${apiConfig.API_BASE_URL}/auth/github`;
    } catch (error) {
      console.error('GitHub login error:', error);
      throw new Error('GitHub login failed. Please try again.');
    }
  },

  loginWithLinkedIn: async () => {
    try {
      // Redirect to LinkedIn OAuth - Uses relative path
      window.location.href = `${apiConfig.API_BASE_URL}/auth/linkedin`;
    } catch (error) {
      console.error('LinkedIn login error:', error);
      throw new Error('LinkedIn login failed. Please try again.');
    }
  },
};

export default authService;
