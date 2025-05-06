// Profile Info Component
// Displays and manages user profile information and preferences

import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';

const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    preferences: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save profile information logic
    console.log('Profile saved:', profile);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Profile Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Preferences"
            name="preferences"
            value={profile.preferences}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileInfo;
