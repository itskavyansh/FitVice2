// Google Fit Sync Status Component
// Shows real-time synchronization status and last sync timestamp

import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import googleFitService from 'services/googleFitService';

const GoogleFitSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    const fetchSyncStatus = async () => {
      const status = await googleFitService.getSyncStatus();
      setSyncStatus(status.syncing);
      setLastSyncTime(status.lastSyncTime);
    };

    fetchSyncStatus();
    const interval = setInterval(fetchSyncStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography variant="h6">Google Fit Sync Status</Typography>
      {syncStatus ? (
        <>
          <Typography variant="body1">Syncing...</Typography>
          <LinearProgress />
        </>
      ) : (
        <Typography variant="body1">
          Last synced: {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Never'}
        </Typography>
      )}
    </Box>
  );
};

export default GoogleFitSyncStatus;
