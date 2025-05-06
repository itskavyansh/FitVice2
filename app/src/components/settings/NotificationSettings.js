// Notification Settings Component
// Controls user notification preferences for workouts, goals, and reminders

import React, { useState } from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Typography } from '@mui/material';

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    goalProgress: true,
    waterReminders: false,
    mealReminders: true,
    achievements: true,
  });

  const handleChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Notification Settings</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={notifications.workoutReminders}
              onChange={handleChange}
              name="workoutReminders"
            />
          }
          label="Workout Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.goalProgress}
              onChange={handleChange}
              name="goalProgress"
            />
          }
          label="Goal Progress Updates"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.waterReminders}
              onChange={handleChange}
              name="waterReminders"
            />
          }
          label="Water Intake Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.mealReminders}
              onChange={handleChange}
              name="mealReminders"
            />
          }
          label="Meal Planning Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.achievements}
              onChange={handleChange}
              name="achievements"
            />
          }
          label="Achievement Notifications"
        />
      </FormGroup>
    </Box>
  );
}

export default NotificationSettings;
