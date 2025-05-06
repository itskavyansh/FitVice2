// Profile Goals Component
// Manages user fitness goals and tracks progress towards achievements

import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, LinearProgress, Typography } from '@mui/material';

const ProfileGoals = () => {
  const [goals, setGoals] = useState([
    { name: 'Run 5km', progress: 70 },
    { name: 'Drink 2L water daily', progress: 50 },
    { name: 'Meditate for 10 minutes', progress: 30 },
  ]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Goals
      </Typography>
      <List>
        {goals.map((goal, index) => (
          <ListItem key={index}>
            <ListItemText primary={goal.name} />
            <LinearProgress variant="determinate" value={goal.progress} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProfileGoals;
