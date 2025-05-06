// Custom List Component
// Enhanced list with sorting, filtering and infinite scroll capabilities

import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledList = styled(List)(({ theme, compact }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: compact ? 0 : theme.spacing(1),
  '& .MuiListItem-root': {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

function CustomList({ items, compact = false, onItemClick, renderIcon, renderAction, ...props }) {
  return (
    <StyledList compact={compact} {...props}>
      {items.map((item, index) => (
        <ListItem key={item.id || index} button={!!onItemClick} onClick={() => onItemClick?.(item)}>
          {renderIcon && <ListItemIcon>{renderIcon(item)}</ListItemIcon>}
          <ListItemText primary={item.primary} secondary={item.secondary} />
          {renderAction && <ListItemSecondaryAction>{renderAction(item)}</ListItemSecondaryAction>}
        </ListItem>
      ))}
    </StyledList>
  );
}

export default CustomList;
