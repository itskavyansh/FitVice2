import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSignOut = async () => {
    try {
      await logout();
      handleClose();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FitVice
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={
                user.profilePicture
                  ? `${process.env.REACT_APP_API_URL}${user.profilePicture}`
                  : null
              }
              alt={user.firstName}
              onClick={handleMenu}
              sx={{ cursor: 'pointer' }}
            >
              {user.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
