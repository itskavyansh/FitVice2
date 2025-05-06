// Custom Card Component
// Flexible card layout with hover effects and consistent styling

import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, elevation = 1, hoverElevation = 3 }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[hoverElevation],
  },
}));

function CustomCard({
  children,
  image,
  actions,
  elevation,
  hoverElevation,
  contentPadding = 2,
  ...props
}) {
  return (
    <StyledCard elevation={elevation} hoverElevation={hoverElevation} {...props}>
      {image && <CardMedia component="img" height="194" image={image} alt="Card image" />}
      <CardContent sx={{ p: contentPadding }}>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
}

export default CustomCard;
