// Backend Status Component
// Monitors and displays API connection status with visual indicators

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const BackendStatus = () => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center">
      {status === 'loading' && <CircularProgress />}
      {status === 'online' && (
        <Typography variant="body1" color="green">
          Online
        </Typography>
      )}
      {status === 'offline' && (
        <Typography variant="body1" color="red">
          Offline
        </Typography>
      )}
    </Box>
  );
};

export default BackendStatus;
