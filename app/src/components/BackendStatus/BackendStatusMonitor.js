// Backend Status Monitor Component
// Tracks and displays API connection status with fallback handling

import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const BackendStatusMonitor = () => {
  const [status, setStatus] = useState('online');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      // Simulate API status check
      const isOnline = Math.random() > 0.5;
      setStatus(isOnline ? 'online' : 'offline');
      setOpen(true);
    };

    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={status === 'online' ? 'success' : 'error'}>
        {status === 'online' ? 'API is online' : 'API is offline'}
      </Alert>
    </Snackbar>
  );
};

export default BackendStatusMonitor;
