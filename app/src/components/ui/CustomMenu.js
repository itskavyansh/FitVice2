// Custom Menu Component
// Enhanced dropdown menu with icons, keyboard navigation and animations

import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: theme.shadows[3],
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1, 2),
      '& .MuiSvgIcon-root': {
        fontSize: 20,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: theme.palette.action.selected,
      },
    },
  },
}));

function CustomMenu({ anchorEl, open, onClose, items }) {
  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            onClose();
            item.onClick?.();
          }}
          disabled={item.disabled}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </MenuItem>
      ))}
    </StyledMenu>
  );
}

export default CustomMenu;
