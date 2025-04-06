import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { 
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  FitnessCenter as FitnessIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  NotificationsActive as NotificationsActiveIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };

  const handleSettings = () => {
    handleClose();
    setSettingsOpen(true);
  };

  const handleAccount = () => {
    handleClose();
    setAccountOpen(true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user's information
    setEditMode(false);
    // Update the user context with new data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const SettingsPanel = () => (
    <Box sx={{ 
      width: isMobile ? '100%' : 420, 
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h5" fontWeight="bold">Settings</Typography>
        <IconButton onClick={() => setSettingsOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flex: 1, overflow: 'hidden' }}>
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="Language" secondary="English" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton sx={{ borderRadius: 1, py: 1.5 }}>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy & Security" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const AccountPanel = () => (
    <Box sx={{ 
      width: isMobile ? '100%' : 460, 
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h5" fontWeight="bold">My Account</Typography>
        <Stack direction="row" spacing={1}>
          {editMode ? (
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={() => setAccountOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mb: 4,
        position: 'relative'
      }}>
        <Avatar
          src={user?.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : null}
          sx={{ 
            width: 140, 
            height: 140, 
            mb: 2,
            boxShadow: theme.shadows[3]
          }}
        >
          {user?.firstName?.[0]?.toUpperCase()}
        </Avatar>
        {editMode && (
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            sx={{ position: 'absolute', bottom: 0 }}
          >
            Change Profile Picture
          </Button>
        )}
      </Box>

      <List sx={{ flex: 1, overflow: 'hidden' }}>
        <ListItem disablePadding sx={{ mb: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              First Name
            </Typography>
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!editMode}
              variant="outlined"
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!editMode}
              variant="outlined"
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              variant="outlined"
              size="small"
              sx={{ mt: 0.5 }}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Phone
            </Typography>
            <TextField
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
              variant="outlined"
              size="small"
              sx={{ mt: 0.5 }}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            FitVice
          </Typography>
          {user && (
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton 
                color="inherit" 
                onClick={handleNotifications}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Avatar
                  src={user.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : null}
                  alt={user.firstName}
                  onClick={handleMenu}
                  sx={{ 
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      boxShadow: '0 0 0 2px rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {user.firstName?.[0]?.toUpperCase()}
                </Avatar>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: 220,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      py: 1,
                      px: 2,
                    },
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleDashboard}>
                  <ListItemIcon>
                    <FitnessIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAccount}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>My Account</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign Out</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '16px 0 0 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: isMobile ? '100%' : 420,
            transition: 'none'
          }
        }}
        SlideProps={{
          timeout: 0
        }}
      >
        <SettingsPanel />
      </Drawer>

      <Drawer
        anchor="right"
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '16px 0 0 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: isMobile ? '100%' : 460,
            transition: 'none'
          }
        }}
        SlideProps={{
          timeout: 0
        }}
      >
        <AccountPanel />
      </Drawer>
    </>
  );
};

export default Navbar;
