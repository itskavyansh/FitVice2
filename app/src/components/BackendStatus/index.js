import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SyncIcon from '@mui/icons-material/Sync';
import CircularProgress from '@mui/material/CircularProgress';

import FitViceApiService from 'services/FitViceApiService';

const BackendStatus = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [currentBackend, setCurrentBackend] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [lastCheck, setLastCheck] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    // Listen for backend status changes
    const handleBackendStatusChange = (event) => {
      const { available, usingBackup, currentUrl, timestamp } = event.detail;
      setIsBackendAvailable(available);
      setIsUsingBackup(usingBackup);
      setCurrentBackend(currentUrl || '');
      setLastCheck(timestamp || new Date());
    };
    
    // Listen for pending request changes
    const handlePendingRequestsChange = (event) => {
      setPendingRequests(event.detail.count);
    };
    
    window.addEventListener('backend-status-change', handleBackendStatusChange);
    window.addEventListener('pending-requests-change', handlePendingRequestsChange);
    
    // Initialize with current status if available
    const currentStatus = FitViceApiService.getBackendStatus?.();
    if (currentStatus) {
      setIsBackendAvailable(currentStatus.available);
      setIsUsingBackup(currentStatus.usingBackup);
      setCurrentBackend(currentStatus.currentUrl || '');
      setLastCheck(currentStatus.timestamp || new Date());
    }
    
    // Get pending requests count
    const pendingCount = FitViceApiService.getPendingRequestsCount?.() || 0;
    setPendingRequests(pendingCount);
    
    return () => {
      window.removeEventListener('backend-status-change', handleBackendStatusChange);
      window.removeEventListener('pending-requests-change', handlePendingRequestsChange);
    };
  }, []);
  
  const formatBackendUrl = (url) => {
    if (!url) return 'Not connected';
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname !== '/' ? urlObj.pathname : ''}`;
    } catch (e) {
      return url;
    }
  };
  
  const formatLastCheck = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const checkTime = new Date(timestamp);
    const diffMs = now - checkTime;
    
    if (diffMs < 1000) return 'Just now';
    if (diffMs < 60000) return `${Math.floor(diffMs / 1000)}s ago`;
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    
    return checkTime.toLocaleTimeString();
  };
  
  const getStatusIcon = () => {
    if (isChecking) return <CircularProgress size={20} color="inherit" />;
    if (isBackendAvailable && !isUsingBackup) return <CheckCircleIcon />;
    if (isBackendAvailable && isUsingBackup) return <WarningIcon />;
    return <CloudOffIcon />;
  };
  
  const getStatusColor = () => {
    if (isBackendAvailable && !isUsingBackup) return 'success.main';
    if (isBackendAvailable && isUsingBackup) return 'warning.main';
    return 'error.main';
  };
  
  const getStatusText = () => {
    if (isBackendAvailable && !isUsingBackup) return 'Connected';
    if (isBackendAvailable && isUsingBackup) return 'Using Backup';
    return 'Offline';
  };
  
  const handleRefreshStatus = () => {
    setIsChecking(true);
    
    // Call the API service to check backend status
    if (FitViceApiService.checkBackendAvailability) {
      FitViceApiService.checkBackendAvailability()
        .finally(() => {
          setIsChecking(false);
        });
    } else {
      // If the method doesn't exist, just simulate a check
      setTimeout(() => {
        setIsChecking(false);
      }, 1000);
    }
  };
  
  const handleProcessPendingRequests = () => {
    if (FitViceApiService.processPendingRequests) {
      FitViceApiService.processPendingRequests();
    }
  };
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  return (
    <>
      <Tooltip title={`Backend: ${getStatusText()}`}>
        <Badge 
          badgeContent={pendingRequests} 
          color="warning"
          overlap="circular"
          invisible={pendingRequests === 0}
        >
          <IconButton 
            color="inherit" 
            onClick={toggleDrawer}
            sx={{ 
              color: getStatusColor(),
              '&:hover': { opacity: 0.8 }
            }}
          >
            {getStatusIcon()}
          </IconButton>
        </Badge>
      </Tooltip>
      
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            Backend Status
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon sx={{ color: getStatusColor() }}>
                {getStatusIcon()}
              </ListItemIcon>
              <ListItemText 
                primary={getStatusText()} 
                secondary={`Last checked: ${formatLastCheck(lastCheck)}`}
              />
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem>
              <ListItemIcon>
                <CloudSyncIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Current Backend" 
                secondary={formatBackendUrl(currentBackend)}
              />
            </ListItem>
            
            {pendingRequests > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemIcon>
                    <SyncIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Pending Requests" 
                    secondary={`${pendingRequests} request(s) waiting to be processed`}
                  />
                </ListItem>
              </>
            )}
          </List>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={handleRefreshStatus}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Refresh Status'}
            </Button>
            
            {pendingRequests > 0 && (
              <Button 
                variant="contained" 
                color="warning"
                onClick={handleProcessPendingRequests}
              >
                Process Pending ({pendingRequests})
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default BackendStatus; 