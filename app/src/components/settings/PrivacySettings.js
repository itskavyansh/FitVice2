// Privacy Settings Component
// Manages data sharing and profile visibility preferences

import React, { useState } from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';

function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    shareWorkouts: true,
    shareAchievements: true,
    allowDataAnalytics: true,
  });

  const handleSwitchChange = (event) => {
    setPrivacy({
      ...privacy,
      [event.target.name]: event.target.checked,
    });
  };

  const handleVisibilityChange = (event) => {
    setPrivacy({
      ...privacy,
      profileVisibility: event.target.value,
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Privacy Settings</Typography>
      <Box my={2}>
        <Typography gutterBottom>Profile Visibility</Typography>
        <Select value={privacy.profileVisibility} onChange={handleVisibilityChange} fullWidth>
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="friends">Friends Only</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </Select>
      </Box>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={privacy.shareWorkouts}
              onChange={handleSwitchChange}
              name="shareWorkouts"
            />
          }
          label="Share Workout Activity"
        />
        <FormControlLabel
          control={
            <Switch
              checked={privacy.shareAchievements}
              onChange={handleSwitchChange}
              name="shareAchievements"
            />
          }
          label="Share Achievements"
        />
        <FormControlLabel
          control={
            <Switch
              checked={privacy.allowDataAnalytics}
              onChange={handleSwitchChange}
              name="allowDataAnalytics"
            />
          }
          label="Allow Anonymous Data Collection for App Improvement"
        />
      </FormGroup>
    </Box>
  );
}

export default PrivacySettings;
