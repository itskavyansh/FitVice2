/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import VideoMeeting from './VideoMeeting';

// React imports
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

// Import 3D card components
import { CardContainer, CardBody, CardItem } from 'components/ui/3d-card';

const consultants = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Fitness & Nutrition Expert',
    experience: '10+ years',
    image:
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: 'Mon-Fri, 9 AM - 5 PM',
    rating: 4.9,
    description:
      'Specializing in personalized fitness programs and nutrition planning for optimal health outcomes.',
  },
  {
    id: 2,
    name: 'Mike Wilson',
    specialty: 'Personal Trainer',
    experience: '8 years',
    image:
      'https://images.pexels.com/photos/4398884/pexels-photo-4398884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: 'Mon-Sat, 7 AM - 7 PM',
    rating: 4.8,
    description:
      'Expert in strength training and functional fitness with a focus on injury prevention.',
  },
  {
    id: 3,
    name: 'Emma Davis',
    specialty: 'Yoga Instructor',
    experience: '6 years',
    image:
      'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    availability: 'Tue-Sun, 8 AM - 6 PM',
    rating: 4.7,
    description:
      'Certified yoga instructor specializing in mindfulness and body awareness techniques.',
  },
];

// Define the ConsultantCard component
function ConsultantCard({ consultant, onClick }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / -20;
    setMousePosition({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <CardContainer>
      <CardBody
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(consultant)}
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
            gutterBottom
            sx={{
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
            }}
          >
            {consultant.name}
          </Typography>
        </CardItem>
        <CardItem translateZ={60}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              className="card-content"
              icon={<PersonIcon />}
              label={consultant.specialty}
              size="small"
              variant="outlined"
            />
            <Chip
              className="card-content"
              icon={<AccessTimeIcon />}
              label={consultant.experience}
              size="small"
              variant="outlined"
            />
          </Box>
        </CardItem>
        <CardItem translateZ={70}>
          <Typography
            className="card-content"
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              maxHeight: '4.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {consultant.description}
          </Typography>
        </CardItem>
        <CardItem translateZ={100} sx={{ width: '100%', mt: 2 }}>
          <img
            className="card-content"
            src={consultant.image}
            alt={consultant.name}
            style={{
              height: '200px',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Consultant';
            }}
          />
        </CardItem>
        <CardItem translateZ={80} sx={{ width: '100%', mt: 2 }}>
          <Button
            className="card-content"
            variant="contained"
            color="primary"
            startIcon={<VideocamIcon />}
            fullWidth
          >
            Book Consultation
          </Button>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

ConsultantCard.propTypes = {
  consultant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

function Consultancy() {
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    notes: '',
  });

  const handleConsultantClick = (consultant) => {
    setSelectedConsultant(consultant);
    setBookingDialogOpen(true);
  };

  const generateMeetingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `meeting-${timestamp}-${random}`;
  };

  const handleBookSession = () => {
    const meetingId = generateMeetingId();
    setActiveSession({
      meetingId,
      consultant: selectedConsultant,
      ...bookingDetails,
    });
    setBookingDialogOpen(false);
  };

  const handleEndCall = () => {
    setActiveSession(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {activeSession ? (
          <VideoMeeting meetingId={activeSession.meetingId} onEndCall={handleEndCall} />
        ) : (
          <>
            <MDBox mb={3}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h4" gutterBottom>
                    Live Fitness Consultations
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Connect with professional fitness trainers and wellness experts through live
                    video sessions.
                  </MDTypography>
                </MDBox>
              </Card>
            </MDBox>

            <Grid container spacing={3}>
              {consultants.map((consultant) => (
                <Grid item xs={12} md={6} lg={4} key={consultant.id}>
                  <ConsultantCard consultant={consultant} onClick={handleConsultantClick} />
                </Grid>
              ))}
            </Grid>

            {/* Booking Dialog */}
            <Dialog
              open={bookingDialogOpen}
              onClose={() => setBookingDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              {selectedConsultant && (
                <>
                  <DialogTitle>Book Session with {selectedConsultant.name}</DialogTitle>
                  <DialogContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Availability: {selectedConsultant.availability}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Select Date"
                          value={bookingDetails.date}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, date: e.target.value })
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Select Time"
                          value={bookingDetails.time}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, time: e.target.value })
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Notes for the consultant"
                          value={bookingDetails.notes}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, notes: e.target.value })
                          }
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBookSession}
                      disabled={!bookingDetails.date || !bookingDetails.time}
                    >
                      Start Session
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

export default Consultancy;
