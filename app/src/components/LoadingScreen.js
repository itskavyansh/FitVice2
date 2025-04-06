import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{ mt: 2 }}
      >
        Loading...
      </Typography>
    </Box>
  );
}

export default LoadingScreen; 