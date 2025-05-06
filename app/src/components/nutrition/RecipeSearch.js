// Recipe Search Component
// Provides advanced recipe search with filters for dietary preferences

import React, { useState } from 'react';
import { Box, TextField, Autocomplete, Chip, Button, Grid } from '@mui/material';

// Component for searching recipes with filters
const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event, value) => {
    setSelectedFilters(value);
  };

  const handleSearch = () => {
    // Logic for searching recipes based on searchTerm and selectedFilters
    console.log('Searching for recipes with term:', searchTerm, 'and filters:', selectedFilters);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Search Recipes"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free']}
            value={selectedFilters}
            onChange={handleFilterChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Filters" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeSearch;
