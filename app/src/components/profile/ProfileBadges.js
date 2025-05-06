// Profile Badges Component
// Displays earned achievements and rewards for fitness milestones

import React from 'react';
import { Box, Grid, Avatar, Typography, Tooltip } from '@mui/material';

// Component to display badges
const ProfileBadges = ({ badges }) => {
  return (
    <Box>
      <Typography variant="h6">Achievements</Typography>
      <Grid container spacing={2}>
        {badges.map((badge, index) => (
          <Grid item key={index}>
            <Tooltip title={badge.description} arrow>
              <Avatar src={badge.image} alt={badge.name} />
            </Tooltip>
            <Typography variant="body2">{badge.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileBadges;
