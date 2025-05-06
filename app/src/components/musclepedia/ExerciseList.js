// Exercise List Component
// Displays filterable, searchable list of exercises with sorting options

import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Box } from '@mui/material';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    // Fetch exercises from API or database
    const fetchExercises = async () => {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedExercises = filteredExercises.sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'difficulty') {
      return a.difficulty - b.difficulty;
    }
    return 0;
  });

  return (
    <Box>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Sort By"
        value={sortOption}
        onChange={handleSortChange}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="difficulty">Difficulty</MenuItem>
      </TextField>
      <Grid container spacing={2}>
        {sortedExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <Box>{exercise.name}</Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExerciseList;
