// Recipe Card Component
// Displays recipe information with nutrition facts and preparation steps

import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { RestaurantMenu, Timer, Person } from '@mui/icons-material';

const RecipeCard = ({ recipe }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={recipe.image} alt={recipe.name} />
      <CardContent>
        <Typography variant="h5" component="div">
          {recipe.name}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <RestaurantMenu />
          <Typography variant="body2" ml={1}>
            {recipe.cuisine}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <Timer />
          <Typography variant="body2" ml={1}>
            {recipe.prepTime} mins
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <Person />
          <Typography variant="body2" ml={1}>
            Serves {recipe.servings}
          </Typography>
        </Box>
        <Typography variant="body2" mt={2}>
          {recipe.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
