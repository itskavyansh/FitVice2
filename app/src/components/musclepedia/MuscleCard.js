// Muscle Card Component
// Interactive muscle group visualization with exercise recommendations

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import MDBox from 'components/MDBox';

const MuscleCard = ({ muscleGroup, exercises }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{muscleGroup}</Typography>
        <Box>
          {exercises.map((exercise, index) => (
            <MDBox key={index} component={motion.div} whileHover={{ scale: 1.1 }}>
              <Typography>{exercise}</Typography>
            </MDBox>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuscleCard;
