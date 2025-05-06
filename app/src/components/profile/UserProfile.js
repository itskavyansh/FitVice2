// User Profile Component
// Manages user information, preferences, and fitness goals

import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, TextField } from '@mui/material';
import MDBox from 'components/MDBox';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    avatar: '',
    preferences: {},
    fitnessGoals: {},
  });

  useEffect(() => {
    // Fetch user data from API or local storage
    const fetchUserData = async () => {
      try {
        const data = await getUserData(); // Replace with actual API call
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save user data to API or local storage
    saveUserData(userInfo); // Replace with actual save function
  };

  return (
    <MDBox>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar src={userInfo.avatar} alt={userInfo.name} />
        <Typography variant="h5">{userInfo.name}</Typography>
        <Typography variant="body1">{userInfo.email}</Typography>
        <TextField label="Name" name="name" value={userInfo.name} onChange={handleInputChange} />
        <TextField label="Email" name="email" value={userInfo.email} onChange={handleInputChange} />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </MDBox>
  );
};

export default UserProfile;
