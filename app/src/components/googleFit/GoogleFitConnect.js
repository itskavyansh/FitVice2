// Google Fit Connect Component
// Handles OAuth connection and data synchronization with Google Fit

import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import googleFitService from 'services/googleFitService';

const GoogleFitConnect = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check initial connection status with Google Fit
    googleFitService.isConnected().then(setIsConnected);
  }, []);

  const handleConnect = async () => {
    // Initiates OAuth connection with Google Fit
    const success = await googleFitService.connect();
    if (success) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = async () => {
    // Disconnects from Google Fit and updates state
    const success = await googleFitService.disconnect();
    if (success) {
      setIsConnected(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Google Fit Connection</Typography>
      {isConnected ? (
        <Button variant="contained" color="secondary" onClick={handleDisconnect}>
          Disconnect
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleConnect}>
          Connect
        </Button>
      )}
    </Box>
  );
};

export default GoogleFitConnect;
