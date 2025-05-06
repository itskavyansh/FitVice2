// Loader Component
// Provides customizable loading animations with progress indication

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function Loader({ size = 40, message = 'Loading...', color = 'primary' }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default Loader;
