// Health Tips Component
// Displays AI-generated health and fitness advice with visual indicators

import React from 'react';
import { Card, CardContent, Typography, Box, Icon } from '@mui/material';

const HealthTips = ({ tips }) => {
  return (
    <Box>
      {tips.map((tip, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6">{tip.title}</Typography>
            <Typography variant="body2">{tip.description}</Typography>
            <Box display="flex" alignItems="center">
              <Icon>{tip.icon}</Icon>
              <Typography variant="caption" style={{ marginLeft: '5px' }}>
                {tip.indicator}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HealthTips;
