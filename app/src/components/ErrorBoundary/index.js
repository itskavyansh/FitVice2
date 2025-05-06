// Error Boundary Component
// Catches and handles React rendering errors gracefully

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error is caught
      return (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }

    // Render children if no error is caught
    return this.props.children;
  }
}

export default ErrorBoundary;
