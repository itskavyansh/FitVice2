import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useMaterialUIController, setLayout } from 'context';
import './auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGithub, loginWithLinkedIn } = useAuth();
  const [controller, dispatch] = useMaterialUIController();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login...');
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
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
        case 'github':
          result = await loginWithGithub();
          break;
        case 'linkedin':
          result = await loginWithLinkedIn();
          break;
        default:
          throw new Error('Invalid provider');
      }

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
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

      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Sign in</p>
        <p className="message">Sign in now and get full access to our app.</p>

        {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

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

        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>

        <Divider sx={{ my: 2, color: 'text.secondary' }}>
          <Typography variant="body2" color="text.secondary">OR</Typography>
        </Divider>

        <div className="social-login">
          <button
            type="button"
            className="social-btn google"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <img src="/google-icon.svg" alt="Google" />
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            className="social-btn github"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <img src="/github-icon.svg" alt="GitHub" />
            <span>Continue with GitHub</span>
          </button>
          <button
            type="button"
            className="social-btn linkedin"
            onClick={() => handleSocialLogin('linkedin')}
            disabled={loading}
          >
            <img src="/linkedin-icon.svg" alt="LinkedIn" />
            <span>Continue with LinkedIn</span>
          </button>
        </div>

        <p className="signin">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate('/signup');
            }}
          >
            Register
          </a>
        </p>
      </form>
    </Box>
  );
};

export default SignIn;
