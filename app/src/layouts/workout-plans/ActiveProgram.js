import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function ActiveProgram({ program, onComplete }) {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Calculate program progress
  const totalDays = parseInt(program.duration.split(' ')[0], 10);
  const progress = (completedWorkouts.length / (totalDays * program.workoutsPerWeek)) * 100;

  // Generate workout schedule
  const workouts = Array.from({ length: totalDays * program.workoutsPerWeek }, (_, index) => ({
    id: index + 1,
    day: Math.floor(index / program.workoutsPerWeek) + 1,
    workout: `Workout ${(index % program.workoutsPerWeek) + 1}`,
    exercises: [
      { name: 'Warm-up', duration: '10 min', completed: false },
      { name: 'Main Exercise 1', sets: '3x12', completed: false },
      { name: 'Main Exercise 2', sets: '3x10', completed: false },
      { name: 'Accessory Work', duration: '15 min', completed: false },
      { name: 'Cool-down', duration: '5 min', completed: false },
    ],
  }));

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutDialogOpen(true);
  };

  const handleWorkoutComplete = () => {
    if (selectedWorkout) {
      setCompletedWorkouts([...completedWorkouts, selectedWorkout.id]);
      setWorkoutDialogOpen(false);
    }
  };

  const isWorkoutCompleted = (workoutId) => completedWorkouts.includes(workoutId);

  return (
    <MDBox>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <MDTypography variant="h4" gutterBottom>
              {program.title} - Progress
            </MDTypography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip icon={<AccessTimeIcon />} label={program.duration} />
              <Chip icon={<FlagIcon />} label={program.level} />
              <Chip icon={<TimerIcon />} label={`${program.workoutsPerWeek}x/week`} />
              <Chip
                icon={<EmojiEventsIcon />}
                label={`${completedWorkouts.length} workouts completed`}
                color="primary"
              />
            </Box>
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 1 }}>
                {progress.toFixed(1)}% Complete
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {workouts.map((workout) => (
              <Grid item xs={12} md={4} key={workout.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    bgcolor: isWorkoutCompleted(workout.id) ? 'success.light' : 'background.paper',
                    '&:hover': { transform: 'scale(1.02)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleWorkoutClick(workout)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">
                        Day {workout.day} - {workout.workout}
                      </Typography>
                      {isWorkoutCompleted(workout.id) && <CheckCircleIcon color="success" />}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        icon={<CalendarTodayIcon />}
                        label={`Day ${workout.day}`}
                        size="small"
                      />
                      <Chip icon={<TimerIcon />} label={program.timePerWorkout} size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Workout Details Dialog */}
      <Dialog
        open={workoutDialogOpen}
        onClose={() => setWorkoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedWorkout && (
          <>
            <DialogTitle>
              Day {selectedWorkout.day} - {selectedWorkout.workout}
            </DialogTitle>
            <DialogContent>
              <List>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isWorkoutCompleted(selectedWorkout.id)}
                        disabled={isWorkoutCompleted(selectedWorkout.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={exercise.sets || exercise.duration}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWorkoutDialogOpen(false)}>Close</Button>
              {!isWorkoutCompleted(selectedWorkout.id) && (
                <Button variant="contained" color="primary" onClick={handleWorkoutComplete}>
                  Complete Workout
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </MDBox>
  );
}

ActiveProgram.propTypes = {
  program: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    workoutsPerWeek: PropTypes.number.isRequired,
    timePerWorkout: PropTypes.string.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ActiveProgram;
