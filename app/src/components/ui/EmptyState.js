// Empty State Component
// Displays placeholder content when no data is available

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function EmptyState({ title, message, actionText, onAction, icon: Icon }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      textAlign="center"
    >
      {Icon && <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
