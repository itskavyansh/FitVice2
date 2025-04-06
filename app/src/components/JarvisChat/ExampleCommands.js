import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const commandCategories = [
  {
    title: 'Task Management',
    icon: <AssignmentIcon />,
    examples: [
      'Create a task to go to the gym tomorrow at 6 PM',
      'Add a high priority task to meal prep for the week',
      'Schedule a workout session for next Monday',
      'Remind me to check my weight this evening',
    ],
  },
  {
    title: 'Workout Planning',
    icon: <FitnessCenterIcon />,
    examples: [
      'Create a 30-minute high intensity cardio workout',
      'Plan a strength training routine for beginners',
      'Make a yoga workout for flexibility',
      'Design a workout plan for muscle gain',
    ],
  },
  {
    title: 'Nutrition & Meal Planning',
    icon: <RestaurantIcon />,
    examples: [
      'Create a vegetarian meal plan for 2000 calories',
      'Plan a keto-friendly diet for the week',
      'Make a gluten-free meal plan',
      'Suggest healthy post-workout snacks',
    ],
  },
  {
    title: 'Progress Tracking',
    icon: <TrackChangesIcon />,
    examples: [
      'Track my workout progress for today',
      'Log my weight and measurements',
      'Show my fitness progress this month',
      'Update my workout achievements',
    ],
  },
];

const ExampleCommands = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        <Box display="flex" alignItems="center" gap={1}>
          <HelpOutlineIcon color="primary" />
          Example Commands
        </Box>
      </Typography>
      
      <List>
        {commandCategories.map((category) => (
          <Paper
            key={category.title}
            elevation={0}
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <ListItem>
              <ListItemIcon>{category.icon}</ListItemIcon>
              <ListItemText primary={category.title} />
            </ListItem>
            <Collapse in={true}>
              <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                {category.examples.map((example) => (
                  <Chip
                    key={example}
                    label={example}
                    variant="outlined"
                    size="small"
                    sx={{ m: 0.5 }}
                    onClick={() => {
                      // You can implement click-to-fill functionality here
                      console.log('Example clicked:', example);
                    }}
                  />
                ))}
              </Box>
            </Collapse>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ExampleCommands; 