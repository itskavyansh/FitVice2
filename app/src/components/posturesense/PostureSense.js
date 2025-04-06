import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PostureSense = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          PostureSense
        </Typography>
        <Typography variant="body1">
          Monitor and improve your posture with real-time feedback and exercises.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PostureSense; 