import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
          await loginWithToken(token);
          navigate('/dashboard');
        } else {
          throw new Error('No token received');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { state: { error: 'Authentication failed. Please try again.' } });
      }
    };

    handleCallback();
  }, [location, navigate, loginWithToken]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="h6">Completing authentication...</Typography>
    </Box>
  );
};

export default AuthCallback; 