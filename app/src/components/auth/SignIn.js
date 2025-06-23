import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useMaterialUIController, setLayout } from 'context';
import { motion } from 'framer-motion';
import './auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
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
      console.log('Attempting login with multi-approach solution...');

      // Provide detailed debug info to user during development
      if (process.env.NODE_ENV === 'development') {
        setError('Trying multiple authentication approaches...');
      }

      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Login failed - invalid response:', result);
        // Display the specific error message from the authentication service
        setError(result.error || 'Authentication failed. Please try again.');

        // Check if we are in offline mode and provide additional guidance
        if (result.error && result.error.includes('offline mode')) {
          setError(
            `${result.error} You can use demo@example.com with password "password123" to login in offline mode.`,
          );
        }
      }
    } catch (error) {
      console.error('Login error:', error);

      // Show detailed error message
      setError(error.message || 'Authentication failed. Please try again.');

      // Offer alternative login methods
      console.log('Suggesting alternative login methods due to error');
    } finally {
      setLoading(false);
    }
  };

  // Handle direct login to bypass normal flow in emergency cases
  const handleDirectLogin = async () => {
    try {
      setError('Attempting direct login to backend...');
      setLoading(true);

      const response = await fetch('https://fitvice-oad4.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token manually
        localStorage.setItem('token', data.token);
        console.log('Direct login successful!');
        navigate('/dashboard', { replace: true });
      } else {
        setError('Direct login failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Direct login error:', err);
      setError('Direct login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a function to fill demo credentials
  const fillDemoCredentials = (email, password) => {
    setFormData({
      email,
      password,
    });
    setError('');
  };

  // Add a function to directly test and use the local backend
  const handleLocalBackendTest = async () => {
    try {
      setError('Testing connection to local backend...');
      setLoading(true);

      // Attempt to directly connect to local backend
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Don't send credentials in preflight request
        credentials: 'omit',
        mode: 'cors',
      });

      console.log('Local backend test response:', response.status);

      if (response.status >= 200 && response.status < 500) {
        setError(`Local backend is reachable with status ${response.status}! 
          
You need to configure CORS on your backend server with these headers:

response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
response.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
response.header('Access-Control-Allow-Credentials', 'true');

For Express, install cors middleware: npm install cors
Then add: app.use(cors({origin: 'http://localhost:3000', credentials: true}));`);
      } else {
        setError(
          `Local backend returned status ${response.status}. Make sure your backend server is running on port 3001.`,
        );
      }
    } catch (error) {
      console.error('Local backend test error:', error);
      setError(`Failed to connect to local backend: ${error.message}. 
      
This is likely a CORS error. You must configure your backend server to accept requests from localhost:3000.

For Express, install cors middleware: npm install cors
Then add: app.use(cors({origin: 'http://localhost:3000', credentials: true}));
      `);
    } finally {
      setLoading(false);
    }
  };

  // Update renderErrorMessage to include direct backend connection option
  const renderErrorMessage = () => {
    if (!error) return null;

    const isOfflineMode = error.includes('offline mode') || error.includes('demo@example.com');

    if (isOfflineMode) {
      return (
        <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          Account not registered
        </p>
      );
    }

    return <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>;
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
          <p className="title">Sign in</p>
          <p className="message">Sign in now and get full access to our app.</p>

          {renderErrorMessage()}

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

          {error && error.includes('failed') && (
            <button
              className="submit"
              type="button"
              style={{ marginTop: '8px', backgroundColor: '#ff9800' }}
              onClick={handleDirectLogin}
              disabled={loading}
            >
              Try Direct Login
            </button>
          )}

          <Divider sx={{ my: 2, color: 'text.secondary' }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

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
      </motion.div>
    </Box>
  );
};

export default SignIn;
