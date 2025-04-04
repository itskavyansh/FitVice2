import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  Badge,
  Menu,
  MenuItem,
  styled,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CameraAlt as CameraAltIcon,
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon,
  RestaurantMenu as RestaurantMenuIcon,
  MonitorWeight as MonitorWeightIcon,
  Build as BuildIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Styled components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: `0 8px 24px 0 rgba(0, 0, 0, 0.15)`,
  margin: '0 auto',
  position: 'relative',
  '&:hover .avatar-overlay': {
    opacity: 1,
  },
}));

const AvatarOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
  cursor: 'pointer',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
}));

// Tab panels
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

// Main component
const Profile = () => {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    height: '',
    weight: '',
    age: '',
    goal: '',
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [pictureError, setPictureError] = useState('');
  const [pictureSuccess, setPictureSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    workoutReminders: true,
    progressUpdates: false,
    friendActivity: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    shareWorkoutProgress: true,
    shareAchievements: true,
    allowTagging: false,
  });

  // Mock fitness stats
  const fitnessStats = {
    workoutsCompleted: 78,
    caloriesBurned: 19850,
    hoursActive: 43,
    achievements: 12,
    currentStreak: 5,
    bestStreak: 14,
    progress: 68,
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        height: user.height || '',
        weight: user.weight || '',
        age: user.age || '',
        goal: user.goal || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSettingsChanged(true);
  };

  const handleNotificationSettingChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
    setSettingsChanged(true);
  };

  const handlePrivacySettingChange = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
    setSettingsChanged(true);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setPictureError('');
    setPictureSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const result = await uploadProfilePicture(formData);
      if (result.success) {
        setPictureSuccess('Profile picture updated successfully');
      } else {
        setPictureError(result.error || 'Failed to update profile picture');
      }
    } catch (err) {
      setPictureError('An error occurred while uploading the image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setProfileSuccess('Profile updated successfully!');
        setSettingsChanged(false);
      } else {
        setProfileError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setProfileError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const notificationsOpen = Boolean(notificationsAnchorEl);

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Please sign in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        ml: { xs: 0, sm: '280px' },
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: '100%', sm: 'calc(100% - 320px)' },
        boxSizing: 'border-box',
        marginRight: { xs: 0, sm: '40px' },
        marginTop: { xs: 2, sm: 3 },
        marginBottom: { xs: 2, sm: 3 },
      }}
    >
      {/* Header with cover image and avatar */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          width: '100%',
        }}
      >
        <Box
          sx={{
            height: { xs: '150px', sm: '200px' },
            backgroundImage:
              'url(https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=1300&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />

          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <IconButton
              sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.2)', mr: 1 }}
              onClick={handleNotificationsClick}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={notificationsOpen}
              onClose={handleNotificationsClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">New workout plan available</Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">You&apos;ve reached your weekly goal!</Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">New health tip available</Typography>
              </MenuItem>
            </Menu>

            <IconButton sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: '-50px', sm: '-60px' },
            textAlign: 'center',
            p: { xs: 2, sm: 3 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <ProfileAvatar
            alt={`${formData.firstName} ${formData.lastName}`}
            src={
              user?.profilePicture
                ? `${process.env.REACT_APP_API_URL || ''}${user.profilePicture}`
                : undefined
            }
            sx={{ fontSize: 60 }}
          >
            {formData.firstName?.[0]?.toUpperCase() || 'U'}
            <AvatarOverlay className="avatar-overlay">
              <input
                accept="image/*"
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton sx={{ color: 'white' }} component="span" disabled={uploading}>
                  <CameraAltIcon />
                </IconButton>
              </label>
            </AvatarOverlay>
          </ProfileAvatar>
          {uploading && <CircularProgress size={24} sx={{ mt: 2 }} />}

          {/* Success/error messages for profile picture */}
          {pictureError && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
              {pictureError}
            </Typography>
          )}

          {pictureSuccess && (
            <Typography color="success.main" sx={{ mt: 1, fontSize: '0.875rem' }}>
              {pictureSuccess}
            </Typography>
          )}

          <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
            {formData.firstName} {formData.lastName}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {formData.bio || 'Fitness enthusiast and health-focused individual'}
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            <Chip
              icon={<FitnessCenterIcon />}
              label="Beginner"
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip icon={<DirectionsRunIcon />} label="Runner" variant="outlined" size="small" />
            <Chip icon={<RestaurantMenuIcon />} label="Nutrition" variant="outlined" size="small" />
          </Stack>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            aria-label="profile tabs"
          >
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<FitnessCenterIcon />} label="Fitness" />
            <Tab icon={<SecurityIcon />} label="Privacy" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>
        </Box>
      </Paper>

      {/* Tab content */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: '16px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '16px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Physical Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fitness Goal"
                      name="goal"
                      select
                      value={formData.goal}
                      onChange={handleChange}
                      variant="outlined"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value=""></option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="general-fitness">General Fitness</option>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save changes button */}
        {settingsChanged && (
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<SaveIcon />}
              sx={{
                px: 4,
                py: 1,
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}

        {/* Success/error messages */}
        {profileError && (
          <Box sx={{ mt: 2 }}>
            <Typography color="error">{profileError}</Typography>
          </Box>
        )}

        {profileSuccess && (
          <Box sx={{ mt: 2 }}>
            <Typography color="success.main">{profileSuccess}</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Progress overview */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '16px' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Fitness Progress
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You&apos;re {fitnessStats.progress}% towards your goal
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={fitnessStats.progress}
                  sx={{ height: 10, borderRadius: 5, mt: 1, mb: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Stats grid */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FitnessCenterIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {fitnessStats.workoutsCompleted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workouts Completed
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DirectionsRunIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {fitnessStats.caloriesBurned.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calories Burned
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <RestaurantMenuIcon sx={{ fontSize: 40, mb: 1, color: '#4caf50' }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {fitnessStats.hoursActive}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hours Active
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MonitorWeightIcon sx={{ fontSize: 40, mb: 1, color: '#ff9800' }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {fitnessStats.achievements}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Achievements Earned
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          {/* Current streak */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '16px' }}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="h6" component="h2">
                      Current Streak
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep it going! Your best streak is {fitnessStats.bestStreak} days.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                        mr: 2,
                      }}
                    >
                      {fitnessStats.currentStreak}
                    </Box>
                    <Typography variant="body1">days in a row</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Privacy Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.profileVisibility}
                      onChange={() => handlePrivacySettingChange('profileVisibility')}
                      color="primary"
                    />
                  }
                  label="Make my profile visible to other users"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.shareWorkoutProgress}
                      onChange={() => handlePrivacySettingChange('shareWorkoutProgress')}
                      color="primary"
                    />
                  }
                  label="Share my workout progress on the platform"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.shareAchievements}
                      onChange={() => handlePrivacySettingChange('shareAchievements')}
                      color="primary"
                    />
                  }
                  label="Share my achievements with followers"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.allowTagging}
                      onChange={() => handlePrivacySettingChange('allowTagging')}
                      color="primary"
                    />
                  }
                  label="Allow others to tag me in photos and posts"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Notification Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationSettingChange('emailNotifications')}
                      color="primary"
                    />
                  }
                  label="Email notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationSettingChange('pushNotifications')}
                      color="primary"
                    />
                  }
                  label="Push notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.workoutReminders}
                      onChange={() => handleNotificationSettingChange('workoutReminders')}
                      color="primary"
                    />
                  }
                  label="Workout reminders"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.progressUpdates}
                      onChange={() => handleNotificationSettingChange('progressUpdates')}
                      color="primary"
                    />
                  }
                  label="Progress updates"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.friendActivity}
                      onChange={() => handleNotificationSettingChange('friendActivity')}
                      color="primary"
                    />
                  }
                  label="Friend activity"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: '16px', mt: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Account Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Button variant="outlined" color="primary" sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}>
              Change Password
            </Button>

            <Button variant="outlined" color="error">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default Profile;
