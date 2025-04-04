import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  // Show loading indicator while authentication is being checked
  if (loading || !initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    console.log('PrivateRoute: No user found, redirecting to signin');
    return <Navigate to="/signin" />;
  }

  // Render the protected component
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
