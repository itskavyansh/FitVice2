import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1">
          Configure your account preferences and application settings.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings; 