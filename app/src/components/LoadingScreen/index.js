// Loading Screen Component
// Displays an animated loading indicator with optional progress feedback

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ message, progress }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress />
      {message && (
        <Typography variant="h6" style={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      )}
      {progress !== undefined && (
        <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
          {progress}%
        </Typography>
      )}
    </Box>
  );
};

export default LoadingScreen;
