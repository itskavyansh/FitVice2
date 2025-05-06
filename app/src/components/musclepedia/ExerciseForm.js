// Exercise Form Component
// Handles creation and editing of exercise entries with validation

import React, { useState } from 'react';
import { Box, TextField, Button, FormControl } from '@mui/material';

const ExerciseForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Exercise Name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={formData.duration || ''}
          onChange={handleChange}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date || ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default ExerciseForm;
