import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  DirectionsRun,
  Favorite,
  Bedtime,
  Scale,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';
import googleFitService from 'services/googleFitService';

const GoogleFitIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitnessData, setFitnessData] = useState({
    steps: [],
    heartRate: [],
    sleep: [],
    weight: [],
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance.isSignedIn.get();
      setIsConnected(isSignedIn);
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  const connectGoogleFit = async () => {
    try {
      setLoading(true);
      await googleFitService.signIn();
      setIsConnected(true);
      await fetchFitnessData();
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectGoogleFit = async () => {
    try {
      setLoading(true);
      await googleFitService.signOut();
      setIsConnected(false);
      setFitnessData({
        steps: [],
        heartRate: [],
        sleep: [],
        weight: [],
      });
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFitnessData = async () => {
    try {
      setLoading(true);
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      const [steps, heartRate, sleep, weight] = await Promise.all([
        googleFitService.getDailySteps(sevenDaysAgo, now),
        googleFitService.getHeartRate(sevenDaysAgo, now),
        googleFitService.getSleepData(sevenDaysAgo, now),
        googleFitService.getWeightData(sevenDaysAgo, now),
      ]);

      setFitnessData({
        steps,
        heartRate,
        sleep,
        weight,
      });
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDataList = (data, icon, unit) => {
    if (!data || data.length === 0) return null;

    return (
      <List>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={`${new Date(item.startTimeMillis).toLocaleDateString()}`}
                secondary={`${item.value[0].fpVal || item.value[0].intVal} ${unit}`}
              />
            </ListItem>
            {index < data.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Google Fit Integration</Typography>
          {isConnected && (
            <IconButton onClick={fetchFitnessData} disabled={loading}>
              <Refresh />
            </IconButton>
          )}
        </Box>

        {!isConnected ? (
          <Button
            variant="contained"
            color="primary"
            onClick={connectGoogleFit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Connect Google Fit
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={disconnectGoogleFit}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Disconnect
            </Button>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <DirectionsRun sx={{ mr: 1 }} />
                      <Typography variant="h6">Steps</Typography>
                    </Box>
                    {renderDataList(fitnessData.steps, <DirectionsRun />, 'steps')}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Favorite sx={{ mr: 1 }} />
                      <Typography variant="h6">Heart Rate</Typography>
                    </Box>
                    {renderDataList(fitnessData.heartRate, <Favorite />, 'BPM')}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Bedtime sx={{ mr: 1 }} />
                      <Typography variant="h6">Sleep</Typography>
                    </Box>
                    {renderDataList(fitnessData.sleep, <Bedtime />, 'hours')}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Scale sx={{ mr: 1 }} />
                      <Typography variant="h6">Weight</Typography>
                    </Box>
                    {renderDataList(fitnessData.weight, <Scale />, 'kg')}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleFitIntegration; 