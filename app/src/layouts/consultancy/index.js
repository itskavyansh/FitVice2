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
import { useState } from 'react';

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

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
                <Grid item xs={12} md={4} key={consultant.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                    onClick={() => handleConsultantClick(consultant)}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={consultant.image}
                      alt={consultant.name}
                      onError={(e) => {
                        e.target.src =
                          'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {consultant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip icon={<PersonIcon />} label={consultant.specialty} size="small" />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={consultant.experience}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {consultant.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VideocamIcon />}
                        fullWidth
                      >
                        Book Consultation
                      </Button>
                    </CardContent>
                  </Card>
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
