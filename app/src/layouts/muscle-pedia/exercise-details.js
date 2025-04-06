import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Collapse,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

function ExerciseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { muscle } = location.state || {};
  const [expandedExercise, setExpandedExercise] = useState(null);

  const handleExpandClick = (exercise) => {
    setExpandedExercise(expandedExercise === exercise ? null : exercise);
  };

  const exerciseVideos = {
    // Chest Exercises
    'Bench Press': 'https://www.youtube.com/embed/rT7DgCr-3pg',
    'Push-ups': 'https://www.youtube.com/embed/IODxDxX7oi4',
    'Chest Fly': 'https://www.youtube.com/embed/eozdVdq78OM',
    'Incline Bench Press': 'https://www.youtube.com/embed/SrqOu55lrYU',
    'Decline Bench Press': 'https://www.youtube.com/embed/LfyQBUKR8SE',
    'Dumbbell Press': 'https://www.youtube.com/embed/VmB1G1K7v94',
    'Cable Crossover': 'https://www.youtube.com/embed/taI4XduLpTk',
    'Pec Deck Machine': 'https://www.youtube.com/embed/1fDfJX8QKvE',

    // Back Exercises
    'Pull-ups': 'https://www.youtube.com/embed/eGo4IYlbE5g',
    'Deadlifts': 'https://www.youtube.com/embed/ytGaGIn3SjE',
    'Bent-over Rows': 'https://www.youtube.com/embed/FWJR5Ve8bnQ',
    'Lat Pulldown': 'https://www.youtube.com/embed/CAwf7n6Luuc',
    'Seated Row': 'https://www.youtube.com/embed/GZbfZ033f74',
    'T-Bar Row': 'https://www.youtube.com/embed/j3Igk5nyZ4w',
    'Single-Arm Dumbbell Row': 'https://www.youtube.com/embed/pYcpY20QaE8',
    'Face Pulls': 'https://www.youtube.com/embed/rep-qVOkqgk',

    // Leg Exercises
    'Squats': 'https://www.youtube.com/embed/bEv6CCg2BC8',
    'Lunges': 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    'Leg Press': 'https://www.youtube.com/embed/IZxyjW7MPJQ',
    'Romanian Deadlifts': 'https://www.youtube.com/embed/JCXUYuzwNrM',
    'Bulgarian Split Squats': 'https://www.youtube.com/embed/2C-uNgKwPLE',
    'Leg Extensions': 'https://www.youtube.com/embed/YyvSfVjQeL0',
    'Leg Curls': 'https://www.youtube.com/embed/1Tq3QdYUuHs',
    'Calf Raises': 'https://www.youtube.com/embed/gwLzYI0C-5E',

    // Bicep Exercises
    'Bicep Curls': 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
    'Hammer Curls': 'https://www.youtube.com/embed/zC3nLlEvin4',
    'Chin-ups': 'https://www.youtube.com/embed/mRy9m2Q7_3s',
    'Preacher Curls': 'https://www.youtube.com/embed/fIWP-FRFNU0',
    'Concentration Curls': 'https://www.youtube.com/embed/0AUGkch3tzc',
    'Cable Curls': 'https://www.youtube.com/embed/NFzTWp2qpiE',
    'Zottman Curls': 'https://www.youtube.com/embed/5QjO-9GXQnM',
    'Spider Curls': 'https://www.youtube.com/embed/7Jq7G9CqYOQ',

    // Tricep Exercises
    'Tricep Dips': 'https://www.youtube.com/embed/6kALZikXxLc',
    'Skull Crushers': 'https://www.youtube.com/embed/d_KZxkY_0cM',
    'Tricep Pushdowns': 'https://www.youtube.com/embed/2-LAMcpzODU',
    'Overhead Tricep Extension': 'https://www.youtube.com/embed/-Vyt2QdsR7E',
    'Close-Grip Bench Press': 'https://www.youtube.com/embed/0JfYxMRsUCQ',
    'Diamond Push-ups': 'https://www.youtube.com/embed/J0DnG1_S92I',
    'Tricep Kickbacks': 'https://www.youtube.com/embed/6SS6K3lAwZ8',
    'Rope Pushdowns': 'https://www.youtube.com/embed/vB5OHsJ3EME',

    // Shoulder Exercises
    'Shoulder Press': 'https://www.youtube.com/embed/QAQ64hK4Xxs',
    'Lateral Raises': 'https://www.youtube.com/embed/3VcKaXpzqRo',
    'Front Raises': 'https://www.youtube.com/embed/-t7fuZ0KhDA',
    'Arnold Press': 'https://www.youtube.com/embed/6Z15_WdXmVw',
    'Upright Rows': 'https://www.youtube.com/embed/amCU-ziHITM',
    'Face Pulls': 'https://www.youtube.com/embed/rep-qVOkqgk',
    'Reverse Flyes': 'https://www.youtube.com/embed/ea_7Wm8-FwY',
    'Shrugs': 'https://www.youtube.com/embed/cJRVVxmytaM',
  };

  const exerciseTips = {
    // Chest Exercises
    'Incline Bench Press': [
      'Set bench to 30-45 degree angle',
      'Keep feet flat on the ground',
      'Grip slightly wider than shoulder width',
      'Lower bar to upper chest',
      'Keep elbows at 45-degree angle',
    ],
    'Decline Bench Press': [
      'Set bench to 15-30 degree decline',
      'Keep feet secured under pads',
      'Grip slightly wider than shoulder width',
      'Lower bar to lower chest',
      'Keep elbows at 45-degree angle',
    ],
    'Dumbbell Press': [
      'Keep dumbbells at shoulder level',
      'Press straight up',
      'Control the descent',
      'Keep wrists straight',
      'Squeeze chest at the top',
    ],
    'Cable Crossover': [
      'Set pulleys above shoulder height',
      'Step forward slightly',
      'Keep slight bend in elbows',
      'Bring hands together in front',
      'Control the return',
    ],
    'Pec Deck Machine': [
      'Adjust seat height properly',
      'Keep back flat against pad',
      'Bring arms together slowly',
      'Squeeze chest at peak',
      'Control the return',
    ],

    // Back Exercises
    'Lat Pulldown': [
      'Grip slightly wider than shoulders',
      'Pull bar to upper chest',
      'Keep chest up',
      'Squeeze shoulder blades together',
      'Control the return',
    ],
    'Seated Row': [
      'Keep back straight',
      'Pull handle to waist',
      'Squeeze shoulder blades',
      'Keep elbows close to body',
      'Control the return',
    ],
    'T-Bar Row': [
      'Keep back straight',
      'Pull weight to chest',
      'Squeeze shoulder blades',
      'Keep chest up',
      'Control the descent',
    ],
    'Single-Arm Dumbbell Row': [
      'Place hand and knee on bench',
      'Keep back parallel to ground',
      'Pull elbow up to side',
      'Squeeze shoulder blade',
      'Control the return',
    ],
    'Face Pulls': [
      'Set cable at face height',
      'Pull rope to forehead',
      'Squeeze shoulder blades',
      'Keep elbows high',
      'Control the return',
    ],

    // Leg Exercises
    'Romanian Deadlifts': [
      'Keep back straight',
      'Hinge at hips',
      'Keep bar close to legs',
      'Lower until hamstrings stretch',
      'Drive through heels',
    ],
    'Bulgarian Split Squats': [
      'Place back foot on bench',
      'Keep front knee aligned',
      'Lower until back knee nearly touches',
      'Keep torso upright',
      'Drive through front heel',
    ],
    'Leg Extensions': [
      'Adjust pad to ankle height',
      'Extend legs fully',
      'Squeeze at the top',
      'Control the descent',
      'Don\'t lock knees',
    ],
    'Leg Curls': [
      'Adjust pad to ankle height',
      'Curl weight up',
      'Squeeze hamstrings',
      'Control the descent',
      'Keep hips on pad',
    ],
    'Calf Raises': [
      'Place balls of feet on platform',
      'Lower heels below platform',
      'Raise up on toes',
      'Squeeze calves at top',
      'Control the descent',
    ],

    // Bicep Exercises
    'Preacher Curls': [
      'Adjust seat height properly',
      'Keep upper arms on pad',
      'Curl weight up',
      'Squeeze at top',
      'Control the descent',
    ],
    'Concentration Curls': [
      'Sit with elbow on inner thigh',
      'Keep upper arm still',
      'Curl weight up',
      'Squeeze at top',
      'Control the descent',
    ],
    'Cable Curls': [
      'Stand with cable at bottom',
      'Keep elbows at sides',
      'Curl weight up',
      'Squeeze at top',
      'Control the return',
    ],
    'Zottman Curls': [
      'Start with palms up',
      'Curl weight up',
      'Rotate palms down',
      'Lower weight slowly',
      'Rotate palms up',
    ],
    'Spider Curls': [
      'Lean over bench',
      'Keep upper arms vertical',
      'Curl weight up',
      'Squeeze at top',
      'Control the descent',
    ],

    // Tricep Exercises
    'Overhead Tricep Extension': [
      'Hold weight overhead',
      'Keep upper arms still',
      'Lower weight behind head',
      'Extend arms fully',
      'Control the movement',
    ],
    'Close-Grip Bench Press': [
      'Grip inside shoulder width',
      'Keep elbows close to body',
      'Lower bar to chest',
      'Press up fully',
      'Control the movement',
    ],
    'Diamond Push-ups': [
      'Place hands close together',
      'Keep body straight',
      'Lower chest to hands',
      'Press up fully',
      'Control the movement',
    ],
    'Tricep Kickbacks': [
      'Bend over with back straight',
      'Keep upper arm still',
      'Extend arm back',
      'Squeeze at top',
      'Control the return',
    ],
    'Rope Pushdowns': [
      'Keep elbows at sides',
      'Push rope down',
      'Spread rope at bottom',
      'Squeeze triceps',
      'Control the return',
    ],

    // Shoulder Exercises
    'Arnold Press': [
      'Start with palms facing you',
      'Press up while rotating',
      'End with palms forward',
      'Control the descent',
      'Rotate back to start',
    ],
    'Upright Rows': [
      'Grip slightly narrower than shoulders',
      'Pull weight up to chin',
      'Keep elbows high',
      'Control the descent',
      'Don\'t use momentum',
    ],
    'Reverse Flyes': [
      'Bend over with back straight',
      'Raise arms to sides',
      'Squeeze shoulder blades',
      'Control the descent',
      'Keep slight bend in elbows',
    ],
    'Shrugs': [
      'Hold weight at sides',
      'Raise shoulders up',
      'Squeeze at top',
      'Control the descent',
      'Don\'t roll shoulders',
    ],
  };

  const exerciseKeyPoints = {
    // Chest Exercises
    'Bench Press': [
      'Keep your back flat on the bench',
      'Grip slightly wider than shoulder width',
      'Lower bar to mid-chest',
      'Keep elbows at 45-degree angle',
      'Drive through your feet',
    ],
    'Push-ups': [
      'Keep your body in a straight line',
      'Hands slightly wider than shoulders',
      'Lower chest to ground',
      'Keep elbows at 45-degree angle',
      'Engage core throughout',
    ],
    'Chest Fly': [
      'Keep slight bend in elbows',
      'Control the movement',
      'Bring arms together in front',
      'Squeeze chest at peak',
      'Keep shoulders back',
    ],

    // Back Exercises
    'Pull-ups': [
      'Grip slightly wider than shoulders',
      'Pull chest to bar',
      'Keep core engaged',
      'Control the descent',
      'Squeeze shoulder blades',
    ],
    'Deadlifts': [
      'Keep back straight',
      'Hinge at hips',
      'Keep bar close to legs',
      'Drive through heels',
      'Squeeze glutes at top',
    ],
    'Bent-over Rows': [
      'Keep back straight',
      'Pull elbows up',
      'Squeeze shoulder blades',
      'Keep chest up',
      'Control the descent',
    ],

    // Leg Exercises
    'Squats': [
      'Keep back straight',
      'Knees aligned with toes',
      'Hips back as if sitting',
      'Chest up',
      'Drive through heels',
    ],
    'Lunges': [
      'Keep torso upright',
      'Front knee aligned with ankle',
      'Back knee nearly touching ground',
      'Step forward with control',
      'Drive through front heel',
    ],
    'Leg Press': [
      'Keep back flat on pad',
      'Feet shoulder-width apart',
      'Lower until knees at 90 degrees',
      'Drive through heels',
      'Don\'t lock knees',
    ],

    // Bicep Exercises
    'Bicep Curls': [
      'Keep elbows at sides',
      'Curl weight up',
      'Squeeze at top',
      'Control the descent',
      'Keep wrists straight',
    ],
    'Hammer Curls': [
      'Keep elbows at sides',
      'Palms facing each other',
      'Curl weight up',
      'Squeeze at top',
      'Control the descent',
    ],

    // Tricep Exercises
    'Tricep Dips': [
      'Keep elbows close to body',
      'Lower until elbows at 90 degrees',
      'Drive through palms',
      'Keep shoulders down',
      'Control the movement',
    ],
    'Skull Crushers': [
      'Keep upper arms vertical',
      'Lower weight to forehead',
      'Extend arms fully',
      'Keep elbows in',
      'Control the descent',
    ],

    // Shoulder Exercises
    'Shoulder Press': [
      'Keep core engaged',
      'Press directly overhead',
      'Don\'t lean back',
      'Control the descent',
      'Keep wrists straight',
    ],
    'Lateral Raises': [
      'Keep slight bend in elbows',
      'Raise arms to shoulder height',
      'Control the movement',
      'Don\'t swing the weights',
      'Keep shoulders down',
    ],
  };

  if (!muscle) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Container>
            <Typography variant="h4">Muscle not found</Typography>
            <Button onClick={() => navigate('/muscle-pedia')}>Go back</Button>
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Container>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/muscle-pedia')}
              sx={{ mb: 2 }}
            >
              Back to MusclePedia
            </Button>
            <Typography variant="h3" gutterBottom>
              {muscle.name} Exercises
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {muscle.description}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Recommended Exercises
                </Typography>
                <List>
                  {muscle.exercises.map((exercise, index) => (
                    <Box key={index}>
                      <ListItem
                        sx={{
                          backgroundColor: 'background.paper',
                          borderRadius: '8px',
                          mb: 1,
                          boxShadow: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                        onClick={() => handleExpandClick(exercise)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography
                                variant="h6"
                                fontWeight="medium"
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                {expandedExercise === exercise ? (
                                  <ExpandLessIcon sx={{ mr: 1 }} />
                                ) : (
                                  <ExpandMoreIcon sx={{ mr: 1 }} />
                                )}
                                {exercise}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Collapse in={expandedExercise === exercise} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Key Points to Focus On:
                          </Typography>
                          <List dense>
                            {exerciseKeyPoints[exercise]?.map((point, pointIndex) => (
                              <ListItem key={pointIndex} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" color="text.secondary">
                                      • {point}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Collapse>
                      {index < muscle.exercises.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: 1,
                  height: '100%',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Exercise Form Demonstration
                </Typography>
                {expandedExercise ? (
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={exerciseVideos[expandedExercise]}
                      title={`${expandedExercise} form demonstration`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: '300px',
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Select an exercise to view its form demonstration
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ExerciseDetails; 