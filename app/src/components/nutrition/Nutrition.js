import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Nutrition = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Nutrition & Health
        </Typography>
        <Typography variant="body1">
          Track your nutrition and get personalized dietary recommendations.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Nutrition; 