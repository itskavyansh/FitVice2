// Theme Settings Component
// Controls application theme preferences including dark mode and color schemes

import React from 'react';
import { Box, Switch, FormControlLabel, Typography, RadioGroup, Radio } from '@mui/material';
import { useMaterialUIController, setDarkMode, setLayout } from 'context';

function ThemeSettings() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode, layout } = controller;

  const handleDarkModeToggle = () => {
    setDarkMode(dispatch, !darkMode);
  };

  const handleLayoutChange = (event) => {
    setLayout(dispatch, event.target.value);
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Theme Settings</Typography>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
        label="Dark Mode"
      />
      <Typography variant="subtitle1">Layout</Typography>
      <RadioGroup value={layout} onChange={handleLayoutChange}>
        <FormControlLabel value="default" control={<Radio />} label="Default" />
        <FormControlLabel value="compact" control={<Radio />} label="Compact" />
      </RadioGroup>
    </Box>
  );
}

export default ThemeSettings;
