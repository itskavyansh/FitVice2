// Nutrition Tracker Component
// Monitors daily caloric intake and macronutrient balance

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, LinearProgress } from '@mui/material';
import MDBox from 'components/MDBox';

const NutritionTracker = () => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  useEffect(() => {
    // Fetch nutrition data from an API or local storage
    const fetchNutritionData = async () => {
      // Example: Replace with actual data fetching logic
      const data = {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fats: 70,
      };
      setCalories(data.calories);
      setProtein(data.protein);
      setCarbs(data.carbs);
      setFats(data.fats);
    };

    fetchNutritionData();
  }, []);

  return (
    <Card>
      <Box p={2}>
        <Typography variant="h5">Nutrition Tracker</Typography>
        <MDBox mt={2}>
          <Typography variant="body1">Calories: {calories}</Typography>
          <LinearProgress variant="determinate" value={(calories / 2500) * 100} />
        </MDBox>
        <MDBox mt={2}>
          <Typography variant="body1">Protein: {protein}g</Typography>
          <LinearProgress variant="determinate" value={(protein / 200) * 100} />
        </MDBox>
        <MDBox mt={2}>
          <Typography variant="body1">Carbs: {carbs}g</Typography>
          <LinearProgress variant="determinate" value={(carbs / 300) * 100} />
        </MDBox>
        <MDBox mt={2}>
          <Typography variant="body1">Fats: {fats}g</Typography>
          <LinearProgress variant="determinate" value={(fats / 100) * 100} />
        </MDBox>
      </Box>
    </Card>
  );
};

export default NutritionTracker;
