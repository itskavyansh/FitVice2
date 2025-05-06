// Nutrition Facts Component
// Displays detailed nutritional information in a standard label format

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

// NutritionFacts component accepts props for nutritional data
const NutritionFacts = ({ data }) => {
  return (
    <Box sx={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', maxWidth: '300px' }}>
      <Typography variant="h6" component="div" gutterBottom>
        Nutrition Facts
      </Typography>
      <Divider />
      <Box sx={{ marginTop: '16px' }}>
        {Object.entries(data).map(([key, value]) => (
          <Box
            key={key}
            sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
          >
            <Typography variant="body2">{key}</Typography>
            <Typography variant="body2">{value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NutritionFacts;
