// Google Fit Data Component
// Displays and manages synchronized fitness data from Google Fit API

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import googleFitService from 'services/googleFitService';

const GoogleFitData = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFitnessData = async () => {
      try {
        const data = await googleFitService.getFitnessData();
        setFitnessData(data);
      } catch (error) {
        console.error('Error fetching fitness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFitnessData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!fitnessData) {
    return (
      <Typography variant="h6" align="center">
        No fitness data available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {fitnessData.map((data, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box border={1} borderRadius={4} padding={2}>
            <Typography variant="h6">{data.name}</Typography>
            <Typography variant="body1">Steps: {data.steps}</Typography>
            <Typography variant="body1">Calories: {data.calories}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default GoogleFitData;
