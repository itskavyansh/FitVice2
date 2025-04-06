/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { MenuItem as MenuItemComponent } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
import MDSnackbar from 'components/MDSnackbar';
import MDProgress from 'components/MDProgress';
import MDAvatar from 'components/MDAvatar';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Framer motion
import { motion, AnimatePresence } from 'framer-motion';
// Date-fns
import { format as formatDate } from 'date-fns';

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import CameraIcon from '@mui/icons-material/Camera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import VideocamIcon from '@mui/icons-material/Videocam';

// Import Chart.js components directly
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
);

function PostureSense() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const counterRef = useRef(0);
  const poseRef = useRef(null);
  const [displayCounter, setDisplayCounter] = useState(0);
  const [displayStage, setDisplayStage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [targetReps, setTargetReps] = useState(10);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState(null);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  // New state variables
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState('bicepCurls');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', color: 'info' });
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user');
  const [showStats, setShowStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState(100);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add refs for display options to always have the latest values in closures
  const showLandmarksRef = useRef(showLandmarks);
  const showConnectorsRef = useRef(showConnectors);
  const showAnglesRef = useRef(showAngles);
  const showStatsRef = useRef(showStats);
  const showInstructionsRef = useRef(showInstructions);

  // Add useRef for cameraFacing to always have the latest value
  const cameraFacingRef = useRef(cameraFacing);

  // Add state variables for stable rep counting
  const confidenceCounterRef = useRef(0);
  const lastValidAngleRef = useRef(null);
  const stageStabilityThreshold = 1; // Reduce from 3 to 1 for more responsive tracking

  // Add state variables for pushup tracking
  const [pushupState, setPushupState] = useState('READY');
  const [pushupLocked, setPushupLocked] = useState(false);
  const pushupTimeoutRef = useRef(null);
  const downPositionConfirmedRef = useRef(false);
  const upPositionConfirmedRef = useRef(false);
  const inTransitionRef = useRef(false);
  const previousAngleRef = useRef(null);

  // Update refs when state changes
  useEffect(() => {
    showLandmarksRef.current = showLandmarks;
    showConnectorsRef.current = showConnectors;
    showAnglesRef.current = showAngles;
    showStatsRef.current = showStats;
    showInstructionsRef.current = showInstructions;
    cameraFacingRef.current = cameraFacing;
  }, [showLandmarks, showConnectors, showAngles, showStats, showInstructions, cameraFacing]);

  const exercises = {
    bicepCurls: {
      name: 'Bicep Curls',
      icon: 'fitness_center',
      difficulty: 'Beginner',
      musclesWorked: ['Biceps', 'Forearms'],
      caloriesPerRep: 0.5,
      downAngle: 160,
      upAngle: 60,
      invertStages: false,
      isVertical: false,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      formFeedback: {
        good: 'Perfect form! Keep your elbows close to your body.',
        medium: 'Try to keep your elbows more stable.',
        bad: 'Your elbows are moving too much. Keep them fixed at your sides.',
      },
      tips: [
        'Keep your elbows close to your body',
        'Maintain a straight back',
        'Control the weight on the way down',
        "Don't swing the weights",
      ],
      instructions: 'Stand with arms at sides, curl weights up to shoulders, then lower back down.',
      image:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#4CAF50',
    },
    pushups: {
      name: 'Push-ups',
      icon: 'fitness_center',
      difficulty: 'Intermediate',
      musclesWorked: ['Chest', 'Triceps', 'Shoulders'],
      caloriesPerRep: 0.6,
      downAngle: 70,
      upAngle: 110,
      invertStages: true,
      isVertical: false,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      formFeedback: {
        good: 'Excellent form! Keep your body straight.',
        medium: 'Try to keep your body more aligned.',
        bad: 'Your hips are sagging. Keep your body straight.',
      },
      tips: [
        'Keep your body straight from head to heels',
        'Elbows close to your body',
        'Hands shoulder-width apart',
        'Lower chest to ground',
      ],
      instructions: 'Keep body straight, lower chest to ground, then push back up.',
      image:
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#2196F3',
    },
    squats: {
      name: 'Squats',
      icon: 'fitness_center',
      difficulty: 'Intermediate',
      musclesWorked: ['Quadriceps', 'Glutes', 'Core'],
      caloriesPerRep: 1.5,
      downAngle: 90, // Keep at 90 for down position (knees bent at 90 degrees)
      upAngle: 160, // Normal standing position
      invertStages: true,
      isVertical: true,
      joints: {
        hip: 23,
        knee: 25,
        ankle: 27,
      },
      formFeedback: {
        good: 'Perfect squat form! Keep your back straight.',
        medium: 'Try to keep your knees aligned with toes.',
        bad: 'Your knees are caving in. Push them out.',
      },
      tips: [
        'Keep your back straight',
        'Knees aligned with toes',
        'Hips back and down',
        'Weight in your heels',
      ],
      instructions:
        'Stand with feet shoulder-width apart, lower body until thighs are parallel to ground.',
      image:
        'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#FF9800',
    },
    shoulderPress: {
      name: 'Shoulder Press',
      icon: 'fitness_center',
      difficulty: 'Intermediate',
      musclesWorked: ['Shoulders', 'Triceps', 'Core'],
      caloriesPerRep: 1.0,
      downAngle: 160,
      upAngle: 60,
      invertStages: false,
      isVertical: false,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      formFeedback: {
        good: 'Great form! Keep your core engaged.',
        medium: 'Try to keep your back more stable.',
        bad: "You're leaning back too much. Keep your core tight.",
      },
      tips: [
        'Keep your core engaged',
        "Don't lean back",
        'Press directly overhead',
        'Control the weight',
      ],
      instructions:
        'Start with weights at shoulder level, press overhead until arms are fully extended.',
      image:
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#9C27B0',
    },
    lateralRaise: {
      name: 'Lateral Raise',
      icon: 'fitness_center',
      difficulty: 'Beginner',
      musclesWorked: ['Shoulders', 'Traps'],
      caloriesPerRep: 0.4,
      downAngle: 20, // Lower start position angle (arms closer to body)
      upAngle: 70, // Upper position angle (arms raised)
      invertStages: false,
      isVertical: true,
      joints: {
        hip: 23,
        shoulder: 11,
        elbow: 13,
      },
      formFeedback: {
        good: 'Perfect form! Keep your arms straight.',
        medium: 'Try to keep your elbows slightly bent.',
        bad: "You're using too much momentum. Slow down.",
      },
      tips: [
        'Keep slight bend in elbows',
        'Raise arms to shoulder height',
        'Control the movement',
        "Don't swing the weights",
      ],
      instructions:
        'Stand with weights by your sides, raise them out to shoulder height with slightly bent elbows.',
      image:
        'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#E91E63',
    },
    lunges: {
      name: 'Lunges',
      icon: 'fitness_center',
      difficulty: 'Intermediate',
      musclesWorked: ['Quadriceps', 'Hamstrings', 'Glutes'],
      caloriesPerRep: 0.5,
      downAngle: 100, // Angle when in full lunge position (knee bent)
      upAngle: 165, // Angle when standing straight
      invertStages: true,
      isVertical: true,
      joints: {
        leftHip: 23,
        leftKnee: 25,
        leftAnkle: 27,
        rightHip: 24,
        rightKnee: 26,
        rightAnkle: 28,
      },
      formFeedback: {
        good: 'Excellent form! Keep your back straight.',
        medium: 'Try to keep your front knee aligned.',
        bad: 'Your front knee is going past your toes.',
      },
      tips: [
        'Keep your back straight',
        'Front knee aligned with ankle',
        'Back knee nearly touching ground',
        'Step forward with control',
      ],
      instructions:
        'Step forward with one leg, lower your hips until both knees are bent at 90 degrees.',
      image:
        'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      color: '#00BCD4',
    },
  };

  useEffect(() => {
    const loadMediaPipeScripts = async () => {
      try {
        setIsLoading(true);
        // Load MediaPipe scripts
        const loadScript = (src) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        await Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js'),
          loadScript(
            'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js',
          ),
          loadScript(
            'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1632432234/camera_utils.js',
          ),
        ]);

        // Wait a bit to ensure scripts are initialized
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsMediaPipeLoaded(true);
        setIsLoading(false);
        setNotification({
          open: true,
          message: 'AI pose detection ready! Start your workout.',
          color: 'success',
        });
      } catch (error) {
        console.error('Error loading MediaPipe:', error);
        setError('Failed to load pose detection libraries. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadMediaPipeScripts();
  }, []);

  const checkDeviceCompatibility = () => {
    // Check if running in a secure context (HTTPS or localhost)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      throw new Error('Camera access requires a secure connection (HTTPS).');
    }

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support camera access. Please use a modern browser.');
    }

    // Check if the device has the required capabilities
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          throw new Error('No camera found on your device.');
        }
        return true;
      });
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Check device compatibility first
      await checkDeviceCompatibility();

      if (!isMediaPipeLoaded) {
        throw new Error('MediaPipe libraries are still loading. Please wait a moment.');
      }

      if (!window.Pose) {
        throw new Error('MediaPipe Pose is not loaded properly. Please refresh the page.');
      }

      // Request camera permissions with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: cameraFacingRef.current,
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      if (!stream) {
        throw new Error('Failed to get camera stream. Please check your camera permissions.');
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch(reject);
              resolve();
            };
            videoRef.current.onerror = (error) => {
              reject(new Error('Error loading video: ' + error.message));
            };
          }
        });

        setIsCameraActive(true);
        startPoseDetection();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Error accessing camera. ';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Please grant camera permissions in your browser settings. ';
        errorMessage += "Click the camera icon in your browser's address bar and allow access.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += 'Camera is in use by another application. Please close other apps using the camera.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera does not support the required resolution. Please try a different camera.';
      } else if (error.message.includes('secure connection')) {
        errorMessage = error.message;
      } else {
        errorMessage += error.message || 'Please try refreshing the page.';
      }

      setError(errorMessage);
      setIsCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    // Properly clean up the pose object
    if (poseRef.current) {
      console.log('Closing MediaPipe Pose instance');
      try {
        poseRef.current.close();
      } catch (e) {
        console.error('Error closing pose:', e);
      }
      poseRef.current = null;
    }
    setIsCameraActive(false);
    // Save the workout if there are reps
    if (displayCounter > 0) {
      saveWorkout();
    }
    setDisplayCounter(0);
    setDisplayStage(null);
    counterRef.current = 0;
    stageRef.current = null;
    setWorkoutStartTime(null);

    // Reset pushup tracking state
    setPushupState('READY');
    setPushupLocked(false);
    downPositionConfirmedRef.current = false;
    upPositionConfirmedRef.current = false;
    inTransitionRef.current = false;
    previousAngleRef.current = null;
    if (pushupTimeoutRef.current) {
      clearTimeout(pushupTimeoutRef.current);
      pushupTimeoutRef.current = null;
    }
  };
  const toggleCameraFacing = async () => {
    if (isCameraActive) {
      stopCamera();
      // Wait for camera to fully stop
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    const newFacing = cameraFacingRef.current === 'user' ? 'environment' : 'user';
    console.log('Toggling camera facing to:', newFacing);
    setCameraFacing(newFacing);
    if (isCameraActive) {
      // Give more time for state to update
      setTimeout(() => {
        console.log('Starting camera with facing:', cameraFacingRef.current);
        startCamera();
      }, 1000);
    }
  };
  const pauseResumeCamera = () => {
    setIsPaused((prev) => !prev);
  };

  // Update the calculateCaloriesBurned function to be more accurate
  const calculateCaloriesBurned = () => {
    if (!selectedExercise || !exercises[selectedExercise] || !currentWeight) return 0;
    const exercise = exercises[selectedExercise];
    const weight = parseFloat(currentWeight) || 70; // Default to 70kg if no weight entered
    const caloriesPerRep = exercise.caloriesPerRep || 0.5;
    // Formula: reps * caloriesPerRep * weight adjustment factor
    const weightFactor = weight / 70; // Normalize to 70kg standard
    return Math.round(displayCounter * caloriesPerRep * weightFactor * 10) / 10;
  };
  const saveWorkout = () => {
    const now = new Date();
    const duration = workoutDuration || Math.round((now - workoutStartTime) / 1000);
    const calories = calculateCaloriesBurned();
    const workout = {
      id: Date.now(),
      date: now.toISOString(),
      exercise: exercises[selectedExercise].name,
      reps: displayCounter,
      targetReps: targetReps,
      duration: duration,
      calories: calories,
      weight: currentWeight || 'Not specified',
      accuracy: accuracyScore,
    };
    const updatedHistory = [workout, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    // Save to localStorage
    try {
      localStorage.setItem('postureSenseHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving workout history:', error);
    }
    setNotification({
      open: true,
      message: 'Workout saved successfully!',
      color: 'success',
    });
  };
  const resetWorkout = () => {
    counterRef.current = 0;
    stageRef.current = null;
    setDisplayCounter(0);
    setDisplayStage(null);
    setAccuracyScore(100);
    setShowCelebration(false);
    setWorkoutDuration(0);
    setCaloriesBurned(0);
    setNotification({
      open: true,
      message: 'Workout reset. Ready to start!',
      color: 'info',
    });
  };
  const toggleFullscreen = () => {
    const container = document.getElementById('posture-sense-container');
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  const getFormFeedback = (angle, exercise) => {
    if (!exercise) return null;
    const targetExercise = exercises[exercise];
    const downAngle = targetExercise.downAngle;
    const upAngle = targetExercise.upAngle;
    // Calculate how close the angle is to the ideal angle for the current stage
    const targetAngle = stageRef.current === 'DOWN' ? downAngle : upAngle;
    const difference = Math.abs(angle - targetAngle);
    // Determine feedback based on difference
    if (difference < 15) {
      return targetExercise.formFeedback.good;
    } else if (difference < 30) {
      return targetExercise.formFeedback.medium;
    } else {
      return targetExercise.formFeedback.bad;
    }
  };
  const updateAccuracyScore = (angle, exercise) => {
    if (!exercise) return;
    const targetExercise = exercises[exercise];
    const targetAngle =
      stageRef.current === 'DOWN' ? targetExercise.downAngle : targetExercise.upAngle;
    const difference = Math.abs(angle - targetAngle);
    // Calculate accuracy as a percentage (100% when difference is 0, 0% when difference is 90 or more)
    const accuracy = Math.max(0, 100 - (difference / 90) * 100);
    // Update accuracy score (weighted average)
    setAccuracyScore((prev) => {
      // 90% previous value, 10% new value for smoothing
      return Math.round((prev * 0.9 + accuracy * 0.1) * 10) / 10;
    });
  };
  // Update workout duration every second when camera is active
  useEffect(() => {
    let interval;
    if (isCameraActive && workoutStartTime && !isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.round((now - workoutStartTime) / 1000);
        setWorkoutDuration(duration);
        setCaloriesBurned(calculateCaloriesBurned());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive, workoutStartTime, isPaused, displayCounter]);
  // Load workout history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('postureSenseHistory');
      if (savedHistory) {
        setWorkoutHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Notification component */}
      <MDSnackbar
        color={notification.color}
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        autoHideDuration={5000}
      />
      {/* Main content */}
      <MDBox
        id="posture-sense-container"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Panel - Exercise Selection & Camera */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', overflow: 'hidden' }}>
              <MDBox p={3}>
                <MDTypography variant="h4" color="dark" gutterBottom fontWeight="bold">
                  AI Posture Sense
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={3}>
                  Select an exercise and let our AI track your form in real-time
                </MDTypography>

                {/* Exercise Selection */}
                <MDBox mb={3}>
                  <Grid container spacing={2}>
                    {Object.entries(exercises).map(([key, exercise]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Card
                          onClick={() => setSelectedExercise(key)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: selectedExercise === key ? 'scale(1.02)' : 'scale(1)',
                            border:
                              selectedExercise === key ? `2px solid ${exercise.color}` : 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow:
                              selectedExercise === key
                                ? '0 8px 16px rgba(0,0,0,0.1)'
                                : '0 4px 6px rgba(0,0,0,0.05)',
                          }}
                        >
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="140"
                              image={exercise.image}
                              alt={exercise.name}
                              sx={{
                                filter: selectedExercise !== key ? 'grayscale(50%)' : 'none',
                                transition: 'filter 0.3s ease',
                              }}
                            />
                            <CardContent>
                              <MDTypography variant="h6" color="dark" gutterBottom>
                                {exercise.name}
                              </MDTypography>
                              <MDTypography variant="body2" color="text" mb={1}>
                                {exercise.instructions}
                              </MDTypography>
                              <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                                {exercise.musclesWorked.map((muscle) => (
                                  <Chip
                                    key={muscle}
                                    label={muscle}
                                    size="small"
                                    sx={{
                                      fontSize: '0.65rem',
                                      height: '20px',
                                      backgroundColor: `${exercise.color}20`,
                                      color: exercise.color,
                                    }}
                                  />
                                ))}
                              </Box>
                              <Box
                                mt={1}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Chip
                                  label={exercise.difficulty}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    height: '20px',
                                    backgroundColor:
                                      exercise.difficulty === 'Beginner'
                                        ? '#4caf5020'
                                        : exercise.difficulty === 'Intermediate'
                                        ? '#ff980020'
                                        : '#f4433620',
                                    color:
                                      exercise.difficulty === 'Beginner'
                                        ? '#4caf50'
                                        : exercise.difficulty === 'Intermediate'
                                        ? '#ff9800'
                                        : '#f44336',
                                  }}
                                />
                                <Icon sx={{ color: exercise.color }}>{exercise.icon}</Icon>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>

                {/* Camera View */}
                <MDBox
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                    backgroundColor: 'grey.100',
                  }}
                >
                  <video ref={videoRef} style={{ display: 'none' }} />
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Loading Overlay */}
                  {isLoading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <CircularProgress sx={{ color: 'white', mb: 2 }} />
                      <MDTypography color="white" variant="h6">
                        Loading AI Pose Detection...
                      </MDTypography>
                    </Box>
                  )}

                  {/* Camera Controls */}
                  {isCameraActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        onClick={toggleFullscreen}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <Icon>{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</Icon>
                      </IconButton>
                      <IconButton
                        onClick={toggleCameraFacing}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <FlipCameraAndroidIcon />
                      </IconButton>
                      <IconButton
                        onClick={pauseResumeCamera}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <Icon>{isPaused ? 'play_arrow' : 'pause'}</Icon>
                      </IconButton>
                      <IconButton
                        onClick={resetWorkout}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <RestartAltIcon />
                      </IconButton>
                    </Box>
                  )}

                  {/* Start Camera Button */}
                  {!isCameraActive && !isLoading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <MDTypography color="white" variant="h5" mb={2}>
                        Ready to Start?
                      </MDTypography>
                      <MDTypography color="white" variant="body2" mb={3}>
                        Select an exercise, set your targets, and click &quot;Start Camera&quot; to
                        begin tracking your workout with AI.
                      </MDTypography>
                      <MDButton
                        variant="contained"
                        color="primary"
                        startIcon={<VideocamIcon />}
                        onClick={startCamera}
                        disabled={isLoading}
                      >
                        Start Camera
                      </MDButton>
                    </Box>
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Right Panel - Workout Stats & Controls */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%', overflow: 'auto' }}>
              <MDBox p={3}>
                <MDTypography variant="h6" color="dark" mb={3} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>{exercises[selectedExercise].icon}</Icon>
                  {exercises[selectedExercise].name}
                </MDTypography>

                {/* Workout Stats */}
                {isCameraActive && (
                  <MDBox mb={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <MDBox
                          textAlign="center"
                          p={2}
                          bgcolor="grey.100"
                          borderRadius="md"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <MDTypography variant="body2" color="text">
                            Reps
                          </MDTypography>
                          <MDTypography variant="h4" color="info">
                            {displayCounter}
                          </MDTypography>
                          <MDBox mt={1}>
                            <MDProgress
                              variant="gradient"
                              color="info"
                              value={Math.min((displayCounter / targetReps) * 100, 100)}
                            />
                          </MDBox>
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox
                          textAlign="center"
                          p={2}
                          bgcolor="grey.100"
                          borderRadius="md"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <MDTypography variant="body2" color="text">
                            Accuracy
                          </MDTypography>
                          <MDTypography
                            variant="h4"
                            color={
                              accuracyScore >= 80
                                ? 'success'
                                : accuracyScore >= 60
                                ? 'warning'
                                : 'error'
                            }
                          >
                            {accuracyScore}%
                          </MDTypography>
                          <MDBox mt={1}>
                            <MDProgress
                              variant="gradient"
                              color={
                                accuracyScore >= 80
                                  ? 'success'
                                  : accuracyScore >= 60
                                  ? 'warning'
                                  : 'error'
                              }
                              value={accuracyScore}
                            />
                          </MDBox>
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox
                          textAlign="center"
                          p={2}
                          bgcolor="grey.100"
                          borderRadius="md"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <MDTypography variant="body2" color="text">
                            Duration
                          </MDTypography>
                          <MDTypography variant="h5" color="dark">
                            {workoutDuration
                              ? `${Math.floor(workoutDuration / 60)}:${(workoutDuration % 60)
                                  .toString()
                                  .padStart(2, '0')}`
                              : '0:00'}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox
                          textAlign="center"
                          p={2}
                          bgcolor="grey.100"
                          borderRadius="md"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <MDTypography variant="body2" color="text">
                            Calories
                          </MDTypography>
                          <MDTypography variant="h5" color="dark">
                            {caloriesBurned}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}

                {/* Exercise Tips */}
                <MDBox mb={3}>
                  <MDTypography
                    variant="subtitle2"
                    color="dark"
                    fontWeight="medium"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <InfoIcon sx={{ fontSize: 20, mr: 1 }} />
                    Form Tips
                  </MDTypography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {exercises[selectedExercise].tips.map((tip, index) => (
                      <MDTypography
                        key={index}
                        component="li"
                        variant="body2"
                        color="text"
                        mb={1}
                        sx={{ display: 'flex', alignItems: 'flex-start' }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: 16,
                            mr: 1,
                            mt: 0.5,
                            color: exercises[selectedExercise].color,
                          }}
                        />
                        {tip}
                      </MDTypography>
                    ))}
                  </Box>
                </MDBox>

                {/* Display Controls */}
                <MDBox>
                  <Divider sx={{ my: 2 }} />
                  <MDTypography variant="subtitle2" color="dark" fontWeight="medium" mb={2}>
                    Display Options
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            key={`landmarks-${showLandmarks}`}
                            checked={showLandmarks}
                            onChange={(e) => {
                              console.log('Landmarks switch changed:', e.target.checked);
                              setShowLandmarks(e.target.checked);
                            }}
                          />
                        }
                        label="Show Landmarks"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            key={`connectors-${showConnectors}`}
                            checked={showConnectors}
                            onChange={(e) => {
                              console.log('Connectors switch changed:', e.target.checked);
                              setShowConnectors(e.target.checked);
                            }}
                          />
                        }
                        label="Show Connectors"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            key={`angles-${showAngles}`}
                            checked={showAngles}
                            onChange={(e) => {
                              console.log('Angles switch changed:', e.target.checked);
                              setShowAngles(e.target.checked);
                            }}
                          />
                        }
                        label="Show Angles"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            key={`stats-${showStats}`}
                            checked={showStats}
                            onChange={(e) => {
                              console.log('Stats switch changed:', e.target.checked);
                              setShowStats(e.target.checked);
                            }}
                          />
                        }
                        label="Show Stats"
                      />
                    </Grid>
                  </Grid>
                </MDBox>

                {/* Save Workout Button */}
                {isCameraActive && displayCounter > 0 && (
                  <MDBox mt={3}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      onClick={saveWorkout}
                      startIcon={<SaveIcon />}
                    >
                      Save Workout
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Celebration Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  maxWidth: '90%',
                  width: '400px',
                }}
              >
                <MDTypography variant="h4" color="success" mb={2}>
                  🎉 Congratulations! 🎉
                </MDTypography>
                <MDTypography variant="body1" color="text" mb={2}>
                  You&apos;ve exceeded your target of {targetReps} reps!
                </MDTypography>
                <MDTypography variant="h5" color="success" mb={3}>
                  New Personal Record!
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <MDBox bgcolor="grey.100" p={1} borderRadius="md">
                      <MDTypography variant="body2">Total Reps</MDTypography>
                      <MDTypography variant="h4" color="info">
                        {displayCounter}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={6}>
                    <MDBox bgcolor="grey.100" p={1} borderRadius="md">
                      <MDTypography variant="body2">Calories</MDTypography>
                      <MDTypography variant="h4" color="info">
                        {caloriesBurned}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PostureSense;
