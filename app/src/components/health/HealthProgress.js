// Health Progress Component
// Visualizes user health goals and progress with customizable metrics

import React from 'react';
import { Box, LinearProgress, Typography, Grid } from '@mui/material';

const HealthProgress = ({ goal, progress, label }) => {
  const progressPercentage = (progress / goal) * 100;

  return (
    <Box>
      <Typography variant="h6">{label}</Typography>
      <Grid container alignItems="center">
        <Grid item xs={10}>
          <LinearProgress variant="determinate" value={progressPercentage} />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2">{`${Math.round(progressPercentage)}%`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthProgress;
