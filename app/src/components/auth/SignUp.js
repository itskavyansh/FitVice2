import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Link,
  Card,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useMaterialUIController, setLayout } from 'context';
import { motion } from 'framer-motion';
import './auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [controller, dispatch] = useMaterialUIController();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set layout to 'vr' to ensure no sidebar is shown
  useEffect(() => {
    setLayout(dispatch, 'vr');

    // Clean up function to reset layout when component unmounts
    return () => {
      // Only reset if this component set it
      if (controller.layout === 'vr') {
        setLayout(dispatch, 'dashboard');
      }
    };
  }, [dispatch, controller.layout]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      console.log('Attempting signup with data:', { ...signupData, password: '[REDACTED]' });
      const result = await signup(signupData);

      if (result.success) {
        console.log('Signup successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('Signup returned error:', result.error);
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup exception caught:', error);
      setError(error.message || 'Signup failed. Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    try {
      let result;
      switch (provider) {
        case 'google':
          result = await loginWithGoogle();
          break;
        default:
          throw new Error('Invalid provider');
      }

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="auth-container"
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="background-animation">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Register</p>
          <p className="message">Signup now and get full access to our app.</p>

          {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

          <div className="flex">
            <label>
              <input
                required
                type="text"
                className="input"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Firstname</span>
            </label>

            <label>
              <input
                required
                type="text"
                className="input"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Lastname</span>
            </label>
          </div>

          <label>
            <input
              required
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Email</span>
          </label>

          <label>
            <input
              required
              type="password"
              className="input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Password</span>
          </label>

          <label>
            <input
              required
              type="password"
              className="input"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Confirm password</span>
          </label>

          <button className="submit" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>

          <Divider sx={{ my: 2, color: 'text.secondary' }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <div className="social-login">
            <button
              type="button"
              className="social-btn google"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="signin">
            Already have an account?{' '}
            <a
              href="/signin"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signin');
              }}
            >
              Signin
            </a>
          </p>
        </form>
      </motion.div>
    </Box>
  );
};

export default SignUp;
