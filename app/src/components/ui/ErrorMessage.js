// Error Message Component
// Displays user-friendly error notifications with optional retry action

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

function ErrorMessage({ message, onRetry }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
      <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
      <Typography color="error" variant="h6" gutterBottom>
        {message || 'An error occurred'}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry} sx={{ mt: 2 }}>
          Try Again
        </Button>
      )}
    </Box>
  );
}

export default ErrorMessage;
