// Health Stats Component
// Tracks and visualizes user health metrics over time

import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

const HealthStats = ({ stats }) => {
  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">{stat.name}</Typography>
              <Typography variant="body1">{stat.value}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default HealthStats;
