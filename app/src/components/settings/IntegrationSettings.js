// Integration Settings Component
// Manages third-party service connections and data synchronization

import React, { useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Switch } from '@mui/material';
import GoogleFitIcon from '@mui/icons-material/DirectionsRun';
import AppleHealthIcon from '@mui/icons-material/Favorite';
import { googleFitService } from 'services/googleFitService';

function IntegrationSettings() {
  const [integrations, setIntegrations] = useState({
    googleFit: false,
    appleHealth: false,
  });

  const handleConnect = async (service) => {
    if (service === 'googleFit') {
      try {
        await googleFitService.connect();
        setIntegrations({ ...integrations, googleFit: true });
      } catch (error) {
        console.error('Failed to connect to Google Fit:', error);
      }
    }
  };

  const handleDisconnect = async (service) => {
    if (service === 'googleFit') {
      try {
        await googleFitService.disconnect();
        setIntegrations({ ...integrations, googleFit: false });
      } catch (error) {
        console.error('Failed to disconnect from Google Fit:', error);
      }
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Service Integrations</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Google Fit" secondary="Sync your workouts and activity data" />
          {integrations.googleFit ? (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDisconnect('googleFit')}
              startIcon={<GoogleFitIcon />}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConnect('googleFit')}
              startIcon={<GoogleFitIcon />}
            >
              Connect
            </Button>
          )}
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Apple Health"
            secondary="Coming soon - sync your health and activity data"
          />
          <Button variant="contained" disabled startIcon={<AppleHealthIcon />}>
            Coming Soon
          </Button>
        </ListItem>
      </List>
    </Box>
  );
}

export default IntegrationSettings;
