// User Settings Component
// Manages user preferences, notifications, and app configuration

import React, { useState, useEffect } from 'react';
import { Box, Switch, FormGroup, FormControlLabel, Typography } from '@mui/material';
import MDBox from 'components/MDBox';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
  });

  useEffect(() => {
    // Load user settings from local storage or API
    const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    setSettings((prevSettings) => ({ ...prevSettings, ...savedSettings }));
  }, []);

  const handleToggle = (setting) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, [setting]: !prevSettings[setting] };
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  return (
    <MDBox>
      <Typography variant="h6">User Settings</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />
          }
          label="Enable Notifications"
        />
        <FormControlLabel
          control={<Switch checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />}
          label="Dark Mode"
        />
      </FormGroup>
    </MDBox>
  );
};

export default UserSettings;
