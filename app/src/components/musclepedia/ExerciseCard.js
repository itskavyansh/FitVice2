// Exercise Card Component
// Shows detailed exercise information with animation and form guidance

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const ExerciseCard = ({ exercise }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={exercise.image} alt={exercise.name} />
      <CardContent>
        <Typography variant="h5" component="div">
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exercise.description}
        </Typography>
        <Box>{/* Add animation or form guidance here */}</Box>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
