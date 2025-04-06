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
  Divider,
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

function ActiveProgram({ program, onComplete }) {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});

  // Calculate program progress
  const totalDays = parseInt(program.duration.split(' ')[0], 10);
  const progress = (completedWorkouts.length / (totalDays * program.workoutsPerWeek)) * 100;

  // Function to generate exercises based on program category and workout number
  const generateExercises = (category, workoutNumber, totalWorkoutsPerWeek) => {
    // Common warm-up and cool-down exercises
    const warmup = { name: 'Warm-up', duration: '10 min', completed: false };
    const cooldown = { name: 'Cool-down', duration: '5 min', completed: false };
    
    // Strength training exercises
    if (category === 'strength') {
      // Full body workout
      if (program.title.includes('Full Body')) {
        // Different exercises for each workout number
        if (workoutNumber === 1) {
          return [
            warmup,
            { name: 'Squats', sets: '4x10', completed: false },
            { name: 'Push-ups', sets: '3x12', completed: false },
            { name: 'Bent-Over Rows', sets: '3x12', completed: false },
            { name: 'Lunges', sets: '3x10 each leg', completed: false },
            { name: 'Plank', sets: '3x30 seconds', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 2) {
          return [
            warmup,
            { name: 'Deadlifts', sets: '4x8', completed: false },
            { name: 'Dumbbell Shoulder Press', sets: '3x10', completed: false },
            { name: 'Lat Pulldowns', sets: '3x12', completed: false },
            { name: 'Step-ups', sets: '3x10 each leg', completed: false },
            { name: 'Russian Twists', sets: '3x15 each side', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 3) {
          return [
            warmup,
            { name: 'Romanian Deadlifts', sets: '4x10', completed: false },
            { name: 'Dumbbell Chest Press', sets: '3x12', completed: false },
            { name: 'Pull-ups or Assisted Pull-ups', sets: '3x8', completed: false },
            { name: 'Bulgarian Split Squats', sets: '3x10 each leg', completed: false },
            { name: 'Side Plank', sets: '3x30 seconds each side', completed: false },
            cooldown,
          ];
        }
      }
      
      // Upper body workout
      if (program.title.includes('Upper Body')) {
        // Different exercises for each workout number
        if (workoutNumber === 1) {
          return [
            warmup,
            { name: 'Bench Press', sets: '4x8', completed: false },
            { name: 'Pull-ups or Assisted Pull-ups', sets: '3x8', completed: false },
            { name: 'Shoulder Press', sets: '3x10', completed: false },
            { name: 'Bicep Curls', sets: '3x12', completed: false },
            { name: 'Tricep Extensions', sets: '3x12', completed: false },
            { name: 'Lateral Raises', sets: '3x12', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 2) {
          return [
            warmup,
            { name: 'Incline Dumbbell Press', sets: '4x10', completed: false },
            { name: 'Barbell Rows', sets: '3x10', completed: false },
            { name: 'Arnold Press', sets: '3x10', completed: false },
            { name: 'Hammer Curls', sets: '3x12', completed: false },
            { name: 'Skull Crushers', sets: '3x12', completed: false },
            { name: 'Front Raises', sets: '3x12', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 3) {
          return [
            warmup,
            { name: 'Decline Bench Press', sets: '4x8', completed: false },
            { name: 'Lat Pulldowns', sets: '3x12', completed: false },
            { name: 'Face Pulls', sets: '3x15', completed: false },
            { name: 'Preacher Curls', sets: '3x12', completed: false },
            { name: 'Diamond Push-ups', sets: '3x10', completed: false },
            { name: 'Reverse Flyes', sets: '3x12', completed: false },
            cooldown,
          ];
        }
      }
      
      // Lower body workout
      if (program.title.includes('Lower Body')) {
        // Different exercises for each workout number
        if (workoutNumber === 1) {
          return [
            warmup,
            { name: 'Squats', sets: '4x10', completed: false },
            { name: 'Romanian Deadlifts', sets: '3x10', completed: false },
            { name: 'Lunges', sets: '3x10 each leg', completed: false },
            { name: 'Calf Raises', sets: '3x15', completed: false },
            { name: 'Glute Bridges', sets: '3x15', completed: false },
            { name: 'Leg Extensions', sets: '3x12', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 2) {
          return [
            warmup,
            { name: 'Bulgarian Split Squats', sets: '4x8 each leg', completed: false },
            { name: 'Hip Thrusts', sets: '3x12', completed: false },
            { name: 'Step-ups', sets: '3x10 each leg', completed: false },
            { name: 'Seated Calf Raises', sets: '3x15', completed: false },
            { name: 'Leg Press', sets: '3x12', completed: false },
            { name: 'Walking Lunges', sets: '3x20 steps', completed: false },
            cooldown,
          ];
        } else if (workoutNumber === 3) {
          return [
            warmup,
            { name: 'Front Squats', sets: '4x8', completed: false },
            { name: 'Good Mornings', sets: '3x10', completed: false },
            { name: 'Box Jumps', sets: '3x10', completed: false },
            { name: 'Standing Calf Raises', sets: '3x15', completed: false },
            { name: 'Leg Curls', sets: '3x12', completed: false },
            { name: 'Pistol Squats (Assisted)', sets: '3x5 each leg', completed: false },
            cooldown,
          ];
        }
      }
      
      // 30-Day Strength Builder (default strength program)
      if (workoutNumber === 1) {
        return [
          warmup,
          { name: 'Squats', sets: '4x10', completed: false },
          { name: 'Push-ups', sets: '3x12', completed: false },
          { name: 'Bent-Over Rows', sets: '3x12', completed: false },
          { name: 'Lunges', sets: '3x10 each leg', completed: false },
          { name: 'Plank', sets: '3x30 seconds', completed: false },
          cooldown,
        ];
      } else if (workoutNumber === 2) {
        return [
          warmup,
          { name: 'Deadlifts', sets: '4x8', completed: false },
          { name: 'Dumbbell Shoulder Press', sets: '3x10', completed: false },
          { name: 'Lat Pulldowns', sets: '3x12', completed: false },
          { name: 'Step-ups', sets: '3x10 each leg', completed: false },
          { name: 'Russian Twists', sets: '3x15 each side', completed: false },
          cooldown,
        ];
      } else if (workoutNumber === 3) {
        return [
          warmup,
          { name: 'Romanian Deadlifts', sets: '4x10', completed: false },
          { name: 'Dumbbell Chest Press', sets: '3x12', completed: false },
          { name: 'Pull-ups or Assisted Pull-ups', sets: '3x8', completed: false },
          { name: 'Bulgarian Split Squats', sets: '3x10 each leg', completed: false },
          { name: 'Side Plank', sets: '3x30 seconds each side', completed: false },
          cooldown,
        ];
      } else if (workoutNumber === 4) {
        return [
          warmup,
          { name: 'Front Squats', sets: '4x8', completed: false },
          { name: 'Incline Push-ups', sets: '3x12', completed: false },
          { name: 'Barbell Rows', sets: '3x10', completed: false },
          { name: 'Walking Lunges', sets: '3x20 steps', completed: false },
          { name: 'Hollow Hold', sets: '3x30 seconds', completed: false },
          cooldown,
        ];
      }
    }
    
    // Cardio exercises
    if (category === 'cardio') {
      if (workoutNumber === 1) {
        return [
          warmup,
          { name: 'Jogging', duration: '10 min', completed: false },
          { name: 'High Knees', sets: '3x30 seconds', completed: false },
          { name: 'Mountain Climbers', sets: '3x30 seconds', completed: false },
          { name: 'Jump Rope', sets: '3x1 min', completed: false },
          { name: 'Burpees', sets: '3x10', completed: false },
          { name: 'Jogging', duration: '10 min', completed: false },
          cooldown,
        ];
      } else if (workoutNumber === 2) {
        return [
          warmup,
          { name: 'Sprint Intervals', sets: '8x30 seconds sprint, 1 min rest', completed: false },
          { name: 'Jumping Jacks', sets: '3x1 min', completed: false },
          { name: 'Plank to Downward Dog', sets: '3x10', completed: false },
          { name: 'Jump Squats', sets: '3x15', completed: false },
          { name: 'Mountain Climbers', sets: '3x45 seconds', completed: false },
          { name: 'Cool-down Jog', duration: '10 min', completed: false },
          cooldown,
        ];
      } else if (workoutNumber === 3) {
        return [
          warmup,
          { name: 'Jump Rope', sets: '3x2 min', completed: false },
          { name: 'Box Jumps', sets: '3x10', completed: false },
          { name: 'High Knees', sets: '3x45 seconds', completed: false },
          { name: 'Mountain Climbers', sets: '3x45 seconds', completed: false },
          { name: 'Burpees', sets: '3x15', completed: false },
          { name: 'Jumping Lunges', sets: '3x10 each leg', completed: false },
          cooldown,
        ];
      }
    }
    
    // Flexibility exercises
    if (category === 'flexibility') {
      if (workoutNumber === 1) {
        return [
          { name: 'Neck Stretches', duration: '2 min', completed: false },
          { name: 'Shoulder Stretches', duration: '2 min', completed: false },
          { name: 'Chest Stretches', duration: '2 min', completed: false },
          { name: 'Back Stretches', duration: '3 min', completed: false },
          { name: 'Hip Stretches', duration: '3 min', completed: false },
          { name: 'Leg Stretches', duration: '3 min', completed: false },
          { name: 'Ankle Stretches', duration: '2 min', completed: false },
        ];
      } else if (workoutNumber === 2) {
        return [
          { name: 'Cat-Cow Stretch', sets: '10 reps', completed: false },
          { name: 'Child\'s Pose', duration: '2 min', completed: false },
          { name: 'Thread the Needle', sets: '5 each side', completed: false },
          { name: 'Pigeon Pose', duration: '2 min each side', completed: false },
          { name: 'Butterfly Stretch', duration: '2 min', completed: false },
          { name: 'Seated Forward Fold', duration: '2 min', completed: false },
          { name: 'Reclined Twist', duration: '1 min each side', completed: false },
        ];
      } else if (workoutNumber === 3) {
        return [
          { name: 'Sun Salutations', sets: '5 rounds', completed: false },
          { name: 'Warrior Poses', duration: '1 min each', completed: false },
          { name: 'Triangle Pose', duration: '1 min each side', completed: false },
          { name: 'Extended Side Angle', duration: '1 min each side', completed: false },
          { name: 'Half Moon Pose', duration: '1 min each side', completed: false },
          { name: 'Tree Pose', duration: '1 min each side', completed: false },
          { name: 'Savasana', duration: '5 min', completed: false },
        ];
      } else if (workoutNumber === 4) {
        return [
          { name: 'Dynamic Hip Circles', sets: '10 each direction', completed: false },
          { name: 'World\'s Greatest Stretch', sets: '5 each side', completed: false },
          { name: 'Thread the Needle', sets: '5 each side', completed: false },
          { name: '90/90 Hip Stretch', duration: '2 min each side', completed: false },
          { name: 'Frog Stretch', duration: '2 min', completed: false },
          { name: 'Butterfly Stretch', duration: '2 min', completed: false },
          { name: 'Seated Forward Fold', duration: '2 min', completed: false },
        ];
      } else if (workoutNumber === 5) {
        return [
          { name: 'Neck Rolls', sets: '5 each direction', completed: false },
          { name: 'Shoulder Rolls', sets: '10 each direction', completed: false },
          { name: 'Arm Circles', sets: '10 each direction', completed: false },
          { name: 'Cat-Cow Stretch', sets: '10 reps', completed: false },
          { name: 'Child\'s Pose', duration: '2 min', completed: false },
          { name: 'Thread the Needle', sets: '5 each side', completed: false },
          { name: 'Reclined Twist', duration: '1 min each side', completed: false },
        ];
      }
    }
    
    // Default exercises
    return [
      warmup,
      { name: 'Main Exercise 1', sets: '3x12', completed: false },
      { name: 'Main Exercise 2', sets: '3x10', completed: false },
      { name: 'Accessory Work', duration: '15 min', completed: false },
      cooldown,
    ];
  };

  // Generate workout schedule with specific exercises
  const workouts = Array.from({ length: totalDays * program.workoutsPerWeek }, (_, index) => {
    const workoutNumber = (index % program.workoutsPerWeek) + 1;
    return {
      id: index + 1,
      day: Math.floor(index / program.workoutsPerWeek) + 1,
      workout: `Workout ${workoutNumber}`,
      exercises: generateExercises(program.category, workoutNumber, program.workoutsPerWeek),
    };
  });

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutDialogOpen(true);
  };

  const handleExerciseToggle = (workoutId, exerciseIndex) => {
    setCompletedExercises(prev => {
      const key = `${workoutId}-${exerciseIndex}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const handleWorkoutComplete = () => {
    if (selectedWorkout) {
      setCompletedWorkouts([...completedWorkouts, selectedWorkout.id]);
      setWorkoutDialogOpen(false);
    }
  };

  const isWorkoutCompleted = (workoutId) => completedWorkouts.includes(workoutId);
  
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    const key = `${workoutId}-${exerciseIndex}`;
    return completedExercises[key] || false;
  };

  // Get icon based on program category
  const getCategoryIcon = () => {
    switch (program.category) {
      case 'strength':
        return <FitnessCenterIcon />;
      case 'cardio':
        return <DirectionsRunIcon />;
      case 'flexibility':
        return <SelfImprovementIcon />;
      default:
        return <FitnessCenterIcon />;
    }
  };

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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCategoryIcon()}
                Day {selectedWorkout.day} - {selectedWorkout.workout}
              </Box>
            </DialogTitle>
            <DialogContent>
              <List>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isExerciseCompleted(selectedWorkout.id, index)}
                          onChange={() => handleExerciseToggle(selectedWorkout.id, index)}
                          disabled={isWorkoutCompleted(selectedWorkout.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={exercise.name}
                        secondary={exercise.sets || exercise.duration}
                      />
                    </ListItem>
                    {index < selectedWorkout.exercises.length - 1 && <Divider />}
                  </React.Fragment>
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
    category: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ActiveProgram;
