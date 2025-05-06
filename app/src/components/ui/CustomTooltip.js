// Custom Tooltip Component
// Enhanced tooltip with rich content support and customizable styling

import React from 'react';
import { Tooltip, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
  },
}));

function CustomTooltip({ title, description, children, ...props }) {
  const content = (
    <Box p={1}>
      {title && (
        <Typography variant="subtitle2" component="div" gutterBottom>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <StyledTooltip title={content} {...props}>
      {children}
    </StyledTooltip>
  );
}

export default CustomTooltip;
