import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state
import Alert from '@mui/material/Alert'; // For error state

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton'; // For potential "Start Workout" button

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Workout Service
import workoutService from 'services/workoutService';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  // Fetch workouts when component mounts
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async (page = 1) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      // The interceptor now returns the data directly
      // The expected structure is { success: true, data: [...], pagination: {...} }
      const response = await workoutService.getWorkouts(page);
      
      // Check if the expected structure is present
      if (response && typeof response.success === 'boolean' && Array.isArray(response.data) && typeof response.pagination === 'object') {
         if (response.success) {
           setWorkouts(response.data);
           setPagination(response.pagination);
         } else {
           // Use the message from the response if available
           const errorMessage = response.message || 'Failed to fetch workouts (API indicated failure).';
           console.error("Error fetching workouts:", errorMessage);
           setError(errorMessage); // Keep error state for potential future use, but won't display Alert
         }
      } else {
         // Handle unexpected response structure
         console.error("Unexpected response structure from getWorkouts:", response);
         setError('Received an unexpected response format from the server.'); // Keep error state
      }
    } catch (err) {
      // Errors thrown by the service (e.g., network error, 401) are caught here
      console.error("Error fetching workouts:", err);
      setError(err.message || 'An error occurred while fetching workouts.'); // Keep error state
    } finally {
      setLoading(false);
    }
  };

  // Handler for starting a new workout - NAVIGATE
  const handleStartWorkout = () => {
    console.log("Start New Workout clicked - Navigating...");
    navigate('/workouts/new');
  };
  
  // TODO: Handler for viewing workout details
  const handleViewDetails = (workoutId) => {
     console.log("View details for workout:", workoutId);
      // Navigate to a workout detail page
  };

  const renderWorkoutList = () => {
    if (loading) {
      return (
        <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </MDBox>
      );
    }

    if (workouts.length === 0 && !loading && !error) { // Only show empty state if no error and not loading
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center" mt={2} mb={2}>
          <MDTypography variant="body2" color="text" sx={{ textAlign: 'center', mb: 2 }}>
            You haven't logged any workouts yet. Click "Start New Workout" to begin tracking your fitness journey!
          </MDTypography>
        </MDBox>
      );
    }

    // Simple list display for now
    return (
      <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} sx={{ listStyle: 'none' }}>
        {workouts.map((workout) => (
          <MDBox 
            key={workout._id} 
            component="li" 
            py={1.5} 
            px={2} 
            mb={1} 
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <MDTypography variant="body2">
              Workout on: {new Date(workout.startTime).toLocaleString()}
            </MDTypography>
            <MDButton 
              variant="text" 
              color="info" 
              size="small"
              onClick={() => handleViewDetails(workout._id)}
            >
              View Details
            </MDButton>
          </MDBox>
        ))}
         {/* TODO: Add Pagination controls based on `pagination` state */}
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2} // Reduced padding slightly
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex" // Use flexbox for alignment
                justifyContent="space-between" // Space out title and button
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Workout Logbook
                </MDTypography>
                <MDButton 
                  variant="contained" 
                  color="white" 
                  onClick={handleStartWorkout}
                >
                  Start New Workout
                </MDButton>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                {renderWorkoutList()}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Workouts; 