import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Health = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Health Dashboard
        </Typography>
        <Typography variant="body1">
          Monitor your overall health metrics and wellness progress.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Health; 