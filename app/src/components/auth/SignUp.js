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
  const { signup, user } = useAuth();
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
