// Custom Dialog Component
// Enhanced dialog with consistent styling and flexible content layout

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CustomDialog({ open, onClose, title, children, actions, maxWidth = 'sm', ...props }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth {...props}>
      <DialogTitle>
        {title}
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Box py={1}>{children}</Box>
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

export default CustomDialog;
