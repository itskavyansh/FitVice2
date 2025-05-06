// Meal Plan Component
// Organizes daily meal schedules with nutritional targets and recipes

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const MealPlan = ({ meals }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meal Plan
      </Typography>
      <Grid container spacing={2}>
        {meals.map((meal, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{meal.name}</Typography>
                <Typography variant="body2">{meal.description}</Typography>
                <Typography variant="body2">Calories: {meal.calories}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealPlan;
