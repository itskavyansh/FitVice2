// Dashboard Stats Component
// Displays key fitness metrics and progress indicators

import React from 'react';
import { Grid, Paper } from '@mui/material';

const DashboardStats = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3}>
          <h3>Calories Burned</h3>
          <p>500 kcal</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3}>
          <h3>Workout Time</h3>
          <p>45 minutes</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3}>
          <h3>Steps Taken</h3>
          <p>10,000 steps</p>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
