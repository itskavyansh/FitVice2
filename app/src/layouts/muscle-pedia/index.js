// @mui material components
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Images
import backImage from 'assets/images/back.jpeg';
import chestImage from 'assets/images/chest.jpeg';
import deltImage from 'assets/images/delt.png';
import tricepImage from 'assets/images/tricep.jpeg';
import bicepImage from 'assets/images/bicep.jpeg';
import legsImage from 'assets/images/legs.jpeg';

// Custom components
import { CardContainer, CardBody, CardItem } from 'components/ui/3d-card';

const muscles = [
  {
    name: 'Chest',
    description: 'The chest muscles, or pectorals, are responsible for pushing movements and upper body strength.',
    exercises: [
      'Bench Press',
      'Push-ups',
      'Chest Fly',
      'Incline Bench Press',
      'Decline Bench Press',
      'Dumbbell Press',
      'Cable Crossover',
      'Pec Deck Machine'
    ],
    image: chestImage
  },
  {
    name: 'Back',
    description: 'The back muscles are crucial for posture and pulling movements.',
    exercises: [
      'Pull-ups',
      'Deadlifts',
      'Bent-over Rows',
      'Lat Pulldown',
      'Seated Row',
      'T-Bar Row',
      'Single-Arm Dumbbell Row',
      'Face Pulls'
    ],
    image: backImage
  },
  {
    name: 'Legs',
    description: 'Leg muscles are the foundation of strength and power.',
    exercises: [
      'Squats',
      'Lunges',
      'Leg Press',
      'Romanian Deadlifts',
      'Bulgarian Split Squats',
      'Leg Extensions',
      'Leg Curls',
      'Calf Raises'
    ],
    image: legsImage
  },
  {
    name: 'Biceps',
    description: 'Biceps are responsible for elbow flexion and forearm supination.',
    exercises: [
      'Bicep Curls',
      'Hammer Curls',
      'Chin-ups',
      'Preacher Curls',
      'Concentration Curls',
      'Cable Curls',
      'Zottman Curls',
      'Spider Curls'
    ],
    image: bicepImage
  },
  {
    name: 'Triceps',
    description: 'Triceps are responsible for elbow extension and arm straightening.',
    exercises: [
      'Tricep Dips',
      'Skull Crushers',
      'Tricep Pushdowns',
      'Overhead Tricep Extension',
      'Close-Grip Bench Press',
      'Diamond Push-ups',
      'Tricep Kickbacks',
      'Rope Pushdowns'
    ],
    image: tricepImage
  },
  {
    name: 'Shoulders',
    description: 'Shoulder muscles are responsible for arm movement and stability.',
    exercises: [
      'Shoulder Press',
      'Lateral Raises',
      'Front Raises',
      'Arnold Press',
      'Upright Rows',
      'Face Pulls',
      'Reverse Flyes',
      'Shrugs'
    ],
    image: deltImage
  }
];

function MuscleCard({ muscle }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / 20;
    setMousePosition({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleCardClick = (e) => {
    navigate(`/muscle-pedia/${muscle.name.toLowerCase()}`, { state: { muscle } });
  };

  return (
    <CardContainer>
      <CardBody
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        sx={{
          transform: `rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,
          position: 'relative',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(0,0,0,0.1)',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            '& .card-content': {
              transform: 'scale(1.05)',
              transition: 'all 0.5s ease',
              transformOrigin: 'center center',
            },
          },
          '& .card-content': {
            transition: 'all 0.5s ease',
            transformOrigin: 'center center',
          },
        }}
      >
        <CardItem translateZ={50}>
          <Typography
            className="card-content"
            variant="h5"
            fontWeight="bold"
            color="text.primary"
            sx={{
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
            }}
          >
            {muscle.name}
          </Typography>
        </CardItem>
        <CardItem translateZ={60}>
          <Typography
            className="card-content"
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 'sm',
              mt: 1,
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
            }}
          >
            {muscle.description}
          </Typography>
        </CardItem>
        <CardItem translateZ={100} sx={{ width: '100%', mt: 2 }}>
          <img
            className="card-content"
            src={muscle.image}
            alt={muscle.name}
            style={{
              height: '240px',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

MuscleCard.propTypes = {
  muscle: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    exercises: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

function MusclePedia() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Typography 
                variant="h2" 
                fontWeight="bold"
                sx={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                MusclePedia
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore different muscles and their functions
              </Typography>
            </MDBox>
          </Grid>
          {muscles.map((muscle, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MuscleCard muscle={muscle} />
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MusclePedia;
