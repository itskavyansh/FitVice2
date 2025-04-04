import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
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
  }
);

const authService = {
  login: async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Login successful for:', email);
        return response.data;
      }
      console.error('Login failed - invalid response:', response.data);
      throw new Error(response.data.message || 'Login failed. Please try again.');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  signup: async (userData) => {
    try {
      console.log('Attempting signup for:', userData.email);
      const response = await api.post('/auth/signup', userData);

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
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
    localStorage.removeItem('token');
    console.log('User logged out');
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return null;
      }

      console.log('Fetching current user');
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        console.log('Current user fetched successfully');
        return response.data.user;
      }
      console.error('Failed to get user data - invalid response:', response.data);
      throw new Error('Failed to get user data');
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
      return null;
    }
  },

  uploadProfilePicture: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      console.log('Uploading profile picture');
      const response = await api.post('/auth/profile/picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await api.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isValid = response.data.success && response.data.valid;
      console.log('Token verification result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Verify token error:', error);
      localStorage.removeItem('token');
      return false;
    }
  },
};

export default authService;
