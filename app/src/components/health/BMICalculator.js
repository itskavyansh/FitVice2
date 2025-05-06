// BMI Calculator Component
// Calculates Body Mass Index with visual feedback and health recommendations

import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import MDBox from 'components/MDBox';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (bmi) {
      if (bmi < 18.5) {
        setFeedback('Underweight');
      } else if (bmi >= 18.5 && bmi < 24.9) {
        setFeedback('Normal weight');
      } else if (bmi >= 25 && bmi < 29.9) {
        setFeedback('Overweight');
      } else {
        setFeedback('Obesity');
      }
    }
  }, [bmi]);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBMI);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        BMI Calculator
      </Typography>
      <MDBox mb={2}>
        <TextField
          label="Weight (kg)"
          variant="outlined"
          fullWidth
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </MDBox>
      <MDBox mb={2}>
        <TextField
          label="Height (cm)"
          variant="outlined"
          fullWidth
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </MDBox>
      <Button variant="contained" color="primary" onClick={calculateBMI}>
        Calculate
      </Button>
      {bmi && (
        <MDBox mt={2}>
          <Typography variant="h6">Your BMI: {bmi}</Typography>
          <Typography variant="body1">{feedback}</Typography>
        </MDBox>
      )}
    </Paper>
  );
};

export default BMICalculator;
