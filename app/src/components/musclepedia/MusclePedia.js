import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MusclePedia = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          MusclePedia
        </Typography>
        <Typography variant="body1">
          Explore detailed information about different muscle groups and exercises.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MusclePedia; 