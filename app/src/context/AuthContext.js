import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Set initial state directly from localStorage
  const initialToken = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Create a memoized version of checkAuth that won't change on re-renders
  const checkAuth = useCallback(async () => {
    console.log('Starting authentication check...');
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found in localStorage, user is not authenticated');
        setUser(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      console.log('Token found in localStorage, validating...');
      // Always set the auth header with the token
      authService.setupAuthHeaderForServiceCalls();

      // Try to get the user data to validate the token
      const userData = await authService.getCurrentUser();

      if (userData) {
        console.log('User data retrieved successfully:', userData.email);
        setUser(userData);
      } else {
        console.log('Failed to get user data, clearing token');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
      console.log('Auth check completed, loading set to false');
    }
  }, []);

  // Use an effect to check authentication on mount
  useEffect(() => {
    console.log('AuthProvider mounted, initial token:', initialToken ? 'exists' : 'none');

    // Initial state setup - always set the header if token exists
    if (initialToken) {
      authService.setupAuthHeaderForServiceCalls();
    }

    // Run the full auth check
    checkAuth();

    // Setup an event listener for storage changes to handle multi-tab logout
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        console.log('Token removed in another tab, logging out');
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initialToken, checkAuth]);

  const login = async (email, password) => {
    try {
      console.log('Logging in user:', email);
      const response = await authService.login(email, password);
      console.log('Login successful, setting user state');
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Signing up user:', userData.email);
      const response = await authService.signup(userData);
      console.log('Signup successful, setting user state');
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    authService.logout();
    setUser(null);
    return { success: true };
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadProfilePicture = async (fileData) => {
    try {
      const response = await authService.uploadProfilePicture(fileData);
      setUser({ ...user, profilePicture: response.profilePicture });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Initiating Google login...');
      await authService.loginWithGoogle();
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGithub = async () => {
    try {
      console.log('Initiating GitHub login...');
      await authService.loginWithGithub();
      return { success: true };
    } catch (error) {
      console.error('GitHub login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      console.log('Initiating LinkedIn login...');
      await authService.loginWithLinkedIn();
      return { success: true };
    } catch (error) {
      console.error('LinkedIn login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithToken = async (token) => {
    try {
      // Store the token
      localStorage.setItem('token', token);
      
      // Set the auth header
      authService.setupAuthHeaderForServiceCalls();
      
      // Get user data
      const userData = await authService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error) {
      console.error('Token login error:', error);
      localStorage.removeItem('token');
      setUser(null);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    initialized,
    login,
    signup,
    logout,
    updateProfile,
    uploadProfilePicture,
    loginWithGoogle,
    loginWithGithub,
    loginWithLinkedIn,
    loginWithToken,
    refreshAuth: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
