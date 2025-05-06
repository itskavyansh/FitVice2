// Profile Stats Component
// Shows user fitness statistics and progress tracking

import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const ProfileStats = ({ stats }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileStats;
