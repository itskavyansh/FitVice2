import React, { useState } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; // Use standard Button here
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; // Use standard Typography
import Alert from '@mui/material/Alert'; // Import Alert

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Service
import workoutService from 'services/workoutService';
import { useNavigate } from 'react-router-dom';

function ActiveWorkout() {
  const navigate = useNavigate();
  const [startTime] = useState(new Date()); // Record start time
  const [exercises, setExercises] = useState([]); // [{ name: 'Bench Press', sets: [{ reps: 10, weight: 50, unit: 'kg' }] }]
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // --- Handlers for adding exercises and sets --- 
  // (Implementation will go here)

  const handleAddExercise = () => {
      if (!currentExerciseName.trim()) return;
      setExercises([...exercises, { name: currentExerciseName.trim(), sets: [] }]);
      setCurrentExerciseName('');
  };

  const handleAddSet = (exerciseIndex) => {
     // Placeholder: add a default set
     const updatedExercises = [...exercises];
     updatedExercises[exerciseIndex].sets.push({ reps: 8, weight: 0, unit: 'kg', notes: '' });
     setExercises(updatedExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
     const updatedExercises = [...exercises];
     // Basic numeric conversion for reps/weight
     const numericValue = (field === 'reps' || field === 'weight') ? Number(value) : value;
     updatedExercises[exerciseIndex].sets[setIndex][field] = numericValue;
     setExercises(updatedExercises);
  };

  // --- Handler for finishing workout ---
  const handleFinishWorkout = async () => {
    setError(null);
    if (exercises.length === 0) {
        setError('Please add at least one exercise.');
        return;
    }
    // Add validation for empty sets etc. later

    setIsSaving(true);
    const workoutData = {
      startTime,
      endTime: new Date(), // Mark end time
      exercises: exercises.map(ex => ({ // Ensure structure matches backend
        name: ex.name,
        sets: ex.sets.map(set => ({ 
          reps: Number(set.reps), 
          weight: Number(set.weight), 
          unit: set.unit || 'kg', 
          notes: set.notes 
        }))
      }))
    };

    try {
      const response = await workoutService.createWorkout(workoutData);
      if (response.success) {
        console.log('Workout saved:', response.data);
        navigate('/workouts'); // Navigate back to logbook on success
      } else {
        setError(response.message || 'Failed to save workout.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}> 
          <Grid item xs={12}>
            <Card>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Active Workout Session
                </MDTypography>
                 <MDButton 
                    variant="contained" 
                    color="white" 
                    onClick={handleFinishWorkout}
                    disabled={isSaving}
                 >
                    {isSaving ? 'Saving...' : 'Finish Workout'}
                 </MDButton>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                 <Typography variant="subtitle1" gutterBottom>
                    Started: {startTime.toLocaleString()}
                 </Typography>

                 {/* Add Exercise Input */}
                 <MDBox display="flex" alignItems="center" mb={2}>
                    <TextField 
                        label="New Exercise Name"
                        variant="outlined"
                        value={currentExerciseName}
                        onChange={(e) => setCurrentExerciseName(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button variant="contained" onClick={handleAddExercise}>Add Exercise</Button>
                 </MDBox>

                {/* Display Exercises and Sets */}
                {exercises.map((exercise, exIndex) => (
                  <Card key={exIndex} sx={{ mb: 2, p: 2, border: '1px solid #eee' }}>
                    <Typography variant="h6">{exercise.name}</Typography>
                    {exercise.sets.map((set, setIndex) => (
                      <MDBox key={setIndex} display="flex" alignItems="center" gap={1} my={1}>
                        <Typography variant="body2" sx={{ minWidth: '40px' }}>Set {setIndex + 1}</Typography>
                        <TextField label="Reps" type="number" size="small" value={set.reps} onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)} />
                        <TextField label="Weight" type="number" size="small" value={set.weight} onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)} />
                        {/* Add Unit Selector Later */}
                        <TextField label="Notes" size="small" value={set.notes} onChange={(e) => handleSetChange(exIndex, setIndex, 'notes', e.target.value)} sx={{flexGrow: 1}}/>
                         {/* Add Delete Set Button Later */}
                      </MDBox>
                    ))}
                    <Button onClick={() => handleAddSet(exIndex)} size="small" sx={{mt: 1}}>Add Set</Button>
                  </Card>
                ))}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}

              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ActiveWorkout; 