/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Images
import upperImage from 'assets/images/upper.png';
import lowerImage from 'assets/images/lower.jpeg';
import fullImage from 'assets/images/full.png';
import cardioImage from 'assets/images/cardio.jpeg';
import strengthImage from 'assets/images/strength.jpeg';
import flexibilityImage from 'assets/images/flexibility.jpeg';

// React imports
import { useState } from 'react';

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ActiveProgram from './ActiveProgram';

const categories = [
  { id: 'all', label: 'All Programs' },
  { id: 'strength', label: 'Strength Training', icon: <FitnessCenterIcon /> },
  { id: 'cardio', label: 'Cardio', icon: <DirectionsRunIcon /> },
  { id: 'flexibility', label: 'Flexibility', icon: <SelfImprovementIcon /> },
];

const sampleWorkoutPlans = [
  {
    id: 1,
    title: '30-Day Strength Builder',
    category: 'strength',
    duration: '30 days',
    level: 'Intermediate',
    description:
      'A comprehensive strength training program focusing on progressive overload and muscle development.',
    image: strengthImage,
    workoutsPerWeek: 4,
    timePerWorkout: '45-60 min',
    features: [
      'Progressive overload training',
      'Full body workouts',
      'Video demonstrations',
      'Nutrition guidelines',
    ],
  },
  {
    id: 2,
    title: 'Full Body Workout',
    category: 'strength',
    duration: '12 weeks',
    level: 'All Levels',
    description:
      'A balanced full-body workout program that targets all major muscle groups in each session for maximum efficiency.',
    image: fullImage,
    workoutsPerWeek: 3,
    timePerWorkout: '50-60 min',
    features: [
      'Compound exercises',
      'Balanced muscle development',
      'Time-efficient workouts',
      'Progressive difficulty',
    ],
  },
  {
    id: 3,
    title: 'Upper Body Workout',
    category: 'strength',
    duration: '8 weeks',
    level: 'Intermediate',
    description:
      'Focus on building upper body strength with targeted exercises for chest, back, shoulders, and arms.',
    image: upperImage,
    workoutsPerWeek: 3,
    timePerWorkout: '45-55 min',
    features: [
      'Chest and back focus',
      'Shoulder development',
      'Arm strengthening',
      'Core integration',
    ],
  },
  {
    id: 4,
    title: 'Lower Body Workout',
    category: 'strength',
    duration: '8 weeks',
    level: 'Intermediate',
    description:
      'Build powerful legs with this comprehensive lower body program targeting quads, hamstrings, glutes, and calves.',
    image: lowerImage,
    workoutsPerWeek: 3,
    timePerWorkout: '45-55 min',
    features: [
      'Leg strength development',
      'Glute activation',
      'Balance improvement',
      'Functional movement patterns',
    ],
  },
  {
    id: 5,
    title: 'Cardio Endurance Program',
    category: 'cardio',
    duration: '8 weeks',
    level: 'All Levels',
    description:
      'Build your endurance and stamina with this progressive cardio program suitable for all fitness levels.',
    image: cardioImage,
    workoutsPerWeek: 3,
    timePerWorkout: '30-45 min',
    features: ['Interval training', 'Heart rate zones', 'Progress tracking', 'Recovery techniques'],
  },
  {
    id: 6,
    title: 'Flexibility & Mobility',
    category: 'flexibility',
    duration: '4 weeks',
    level: 'Beginner',
    description:
      'Improve your flexibility and overall mobility with guided stretching and targeted mobility exercises.',
    image: flexibilityImage,
    workoutsPerWeek: 5,
    timePerWorkout: '20-30 min',
    features: [
      'Dynamic stretching routines',
      'Joint mobility exercises',
      'Recovery techniques',
      'Posture improvement',
    ],
  },
];

function WorkoutPlans() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState(null);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleStartProgram = () => {
    setActiveProgram(selectedPlan);
    setDialogOpen(false);
  };

  const filteredPlans = sampleWorkoutPlans.filter(
    (plan) => selectedCategory === 'all' || plan.category === selectedCategory,
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {activeProgram ? (
          <ActiveProgram program={activeProgram} onComplete={() => setActiveProgram(null)} />
        ) : (
          <>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox p={3}>
                      <MDTypography variant="h4" gutterBottom>
                        Workout Programs
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        Choose from our selection of professionally designed workout programs to
                        achieve your fitness goals.
                      </MDTypography>
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>

            <MDBox mb={3}>
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                {categories.map((category) => (
                  <Tab
                    key={category.id}
                    value={category.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.label}
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </MDBox>

            <Grid container spacing={3}>
              {filteredPlans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                    onClick={() => handlePlanClick(plan)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={plan.image}
                      alt={plan.title}
                      onError={(e) => {
                        e.target.src =
                          'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                      sx={{
                        objectFit: 'cover',
                        backgroundColor: 'grey.200',
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {plan.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip icon={<AccessTimeIcon />} label={plan.duration} size="small" />
                        <Chip icon={<FlagIcon />} label={plan.level} size="small" />
                        <Chip
                          icon={<TimerIcon />}
                          label={`${plan.workoutsPerWeek}x/week`}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Program Details Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
              {selectedPlan && (
                <>
                  <DialogTitle>{selectedPlan.title}</DialogTitle>
                  <DialogContent>
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={selectedPlan.image}
                        alt={selectedPlan.title}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          height: '300px',
                          objectFit: 'cover',
                          backgroundColor: 'grey.200',
                        }}
                        onError={(e) => {
                          e.target.src =
                            'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                        }}
                      />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {selectedPlan.description}
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Duration: {selectedPlan.duration}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {selectedPlan.workoutsPerWeek} workouts/week
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Level: {selectedPlan.level}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {selectedPlan.timePerWorkout} per workout
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                      Program Features:
                    </Typography>
                    <List>
                      {selectedPlan.features.map((feature, index) => (
                        <ListItem key={index} dense>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    <Button variant="contained" color="primary" onClick={handleStartProgram}>
                      Start Program
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default WorkoutPlans;
