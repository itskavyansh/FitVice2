// Muscle Group Card Component
// Displays interactive muscle group information with 3D model integration

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MuscleGroupCard = ({ muscleGroup }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{muscleGroup.name}</Typography>
        <Box>
          {/* Placeholder for 3D model integration */}
          <Typography variant="body2">3D model coming soon...</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuscleGroupCard;
