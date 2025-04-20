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
          setError(`${result.error} You can use demo@example.com with password "password123" to login in offline mode.`);
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
          password: formData.password
        })
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
      password
    });
    setError('');
  };

  // Update renderErrorMessage to include clickable demo accounts
  const renderErrorMessage = () => {
    if (!error) return null;
    
    const isOfflineMode = error.includes('offline mode') || error.includes('demo@example.com');
    
    if (isOfflineMode) {
      return (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fffde7', 
          border: '1px solid #ffd54f',
          borderRadius: '4px',
          marginBottom: '15px' 
        }}>
          <p style={{ color: '#ff8f00', marginBottom: '5px', fontWeight: 'bold' }}>
            ⚠️ Offline Mode Detected
          </p>
          <p style={{ color: '#424242', fontSize: '14px', marginBottom: '5px' }}>
            The backend server appears to be unavailable. Click on a demo account to log in:
          </p>
          <ul style={{ color: '#424242', fontSize: '14px', marginLeft: '20px' }}>
            <li>
              <button 
                type="button"
                onClick={() => fillDemoCredentials('demo@example.com', 'password123')}
                style={{ 
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  color: '#1976d2',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Demo User
              </button> (demo@example.com / password123)
            </li>
            <li>
              <button 
                type="button"
                onClick={() => fillDemoCredentials('admin@example.com', 'admin123')}
                style={{ 
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  color: '#1976d2',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Admin User
              </button> (admin@example.com / admin123)
            </li>
          </ul>
        </div>
      );
    }
    
    return (
      <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>
    );
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
