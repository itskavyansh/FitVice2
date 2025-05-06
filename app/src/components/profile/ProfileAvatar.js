// Profile Avatar Component
// Handles user profile image display and upload functionality

import React, { useState } from 'react';
import { Avatar, Badge, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

// Component to display and upload user profile image
const ProfileAvatar = ({ imageUrl, onImageUpload }) => {
  const [image, setImage] = useState(imageUrl);

  // Function to handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        if (onImageUpload) {
          onImageUpload(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <IconButton color="primary" component="label">
          <PhotoCamera />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </IconButton>
      }
    >
      <Avatar src={image} alt="Profile Avatar" />
    </Badge>
  );
};

export default ProfileAvatar;
