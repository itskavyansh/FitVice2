// Accessibility Settings Component
// Manages user accessibility preferences like font size and color contrast

import React from 'react';
import { Box, Slider, Typography, Switch, FormControlLabel } from '@mui/material';
import { useMaterialUIController, setFontSize, setInvertColors } from 'context';

function AccessibilitySettings() {
  const [controller, dispatch] = useMaterialUIController();
  const { fontSize, invertColors } = controller;

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(dispatch, newValue);
  };

  const handleInvertColorsChange = () => {
    setInvertColors(dispatch, !invertColors);
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Accessibility Settings</Typography>
      <Box my={2}>
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          value={fontSize}
          min={0.8}
          max={1.4}
          step={0.1}
          onChange={handleFontSizeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}x`}
        />
      </Box>
      <FormControlLabel
        control={<Switch checked={invertColors} onChange={handleInvertColorsChange} />}
        label="High Contrast Mode"
      />
    </Box>
  );
}

export default AccessibilitySettings;
