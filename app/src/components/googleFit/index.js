// Google Fit Integration Component
// Handles Google Fit API authentication and data synchronization

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useGoogleFitService } from 'services/googleFitService';

const GoogleFit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authenticate, fetchData } = useGoogleFitService();

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthentication = async () => {
      setLoading(true);
      const authenticated = await authenticate();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuthentication();
  }, [authenticate]);

  const handleSyncData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4">Google Fit Integration</Typography>
      {loading ? (
        <CircularProgress />
      ) : isAuthenticated ? (
        <Button variant="contained" onClick={handleSyncData}>
          Sync Data
        </Button>
      ) : (
        <Typography variant="body1">Please authenticate to use Google Fit.</Typography>
      )}
    </Box>
  );
};

export default GoogleFit;
