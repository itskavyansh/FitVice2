import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken, user, loading, initialized } = useAuth();
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  // Handle token processing
  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('OAuth callback started, location:', location.search);
        
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        console.log('OAuth callback params:', { token: !!token, error });

        if (error) {
          console.error('OAuth error:', error);
          setProcessingError('Authentication failed');
          navigate('/signin?error=auth_failed', { replace: true });
          return;
        }

        if (!token) {
          console.error('No token received');
          setProcessingError('No authentication token received');
          navigate('/signin?error=no_token', { replace: true });
          return;
        }

        console.log('Processing token...');
        
        // Login with token
        const result = await loginWithToken(token);
        
        console.log('Token login result:', result);
        
        if (result.success) {
          console.log('Token login successful, setting token processed');
          // Store token in localStorage (in case it wasn't stored)
          localStorage.setItem('token', token);
          setTokenProcessed(true);
          
          // Force redirect to dashboard immediately
          console.log('Forcing redirect to dashboard...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        } else {
          console.error('Login failed:', result.error);
          setProcessingError(result.error || 'Authentication failed');
          navigate('/signin?error=auth_failed', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setProcessingError(error.message || 'Authentication failed');
        navigate('/signin?error=auth_failed', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, loginWithToken, location]);

  // Handle navigation after successful authentication
  useEffect(() => {
    console.log('Navigation effect triggered:', { tokenProcessed, initialized, user: !!user });
    
    if (tokenProcessed && initialized && user) {
      console.log('Authentication successful, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [tokenProcessed, initialized, user, navigate]);

  // Fallback: if user is already logged in, redirect to dashboard
  useEffect(() => {
    console.log('Fallback effect triggered:', { user: !!user, initialized, tokenProcessed });
    
    if (user && initialized && !tokenProcessed) {
      console.log('User already logged in, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [user, initialized, tokenProcessed, navigate]);

  // Emergency redirect if we have a token but no user after 3 seconds
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user && initialized && !loading) {
      console.log('Emergency redirect: token exists but no user, redirecting to dashboard...');
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, initialized, loading, navigate]);

  // Show loading state while processing
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6">
        {processingError ? 'Authentication failed' : 'Completing authentication...'}
      </Typography>
      {processingError && (
        <Typography variant="body2" color="error">
          {processingError}
        </Typography>
      )}
    </Box>
  );
};

export default OAuthCallback; 