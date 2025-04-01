/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { MenuItem as MenuItemComponent } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import MDSnackbar from "components/MDSnackbar";
import MDProgress from "components/MDProgress";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";
// Date-fns
import { format as formatDate } from "date-fns";

// Icons
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import CameraIcon from "@mui/icons-material/Camera";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
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
  const [currentWeight, setCurrentWeight] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState(null);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  
  // New state variables
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState("bicepCurls");
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: "", color: "info" });
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [showStats, setShowStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAngles, setShowAngles] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showConnectors, setShowConnectors] = useState(true);
  const [accuracyScore, setAccuracyScore] = useState(0);
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
      name: "Bicep Curls",
      downAngle: 160,
      upAngle: 30,
      invertStages: false,
      isVertical: false,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      instructions: "Stand with arms at sides, curl weights up to shoulders, then lower back down.",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#4CAF50",
      icon: "fitness_center",
      tips: [
        "Keep your elbows close to your torso",
        "Control the motion both up and down",
        "Breathe out as you curl up, in as you lower",
      ],
      formFeedback: {
        good: "Great form! Keep your back straight.",
        medium: "Try to keep your elbows more stable.",
        bad: "Watch your elbow position and slow down the movement.",
      },
      musclesWorked: ["Biceps", "Forearms"],
      difficulty: "Beginner",
      caloriesPerRep: 0.5,
    },
    pushups: {
      name: "Push-ups",
      downAngle: 90,
      upAngle: 30,
      invertStages: true,
      isVertical: true,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      instructions: "Keep body straight, lower chest to ground, then push back up.",
      image: "https://images.unsplash.com/photo-1598971639058-bb01d3c8cc72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#2196F3",
      icon: "accessibility_new",
      tips: [
        "Keep your body in a straight line",
        "Position hands slightly wider than shoulders",
        "Look slightly ahead of you, not directly down",
      ],
      formFeedback: {
        good: "Perfect plank position! Great depth.",
        medium: "Try to keep your back flatter during the movement.",
        bad: "Your hips are sagging. Engage your core more.",
      },
      musclesWorked: ["Chest", "Shoulders", "Triceps", "Core"],
      difficulty: "Intermediate",
      caloriesPerRep: 0.8,
    },
    squats: {
      name: "Squats",
      downAngle: 90,
      upAngle: 30,
      invertStages: true,
      isVertical: true,
      joints: {
        hip: 23,
        knee: 25,
        ankle: 27,
      },
      instructions:
        "Stand with feet shoulder-width apart, lower body until thighs are parallel to ground.",
      image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#FF9800",
      icon: "directions_run",
      tips: [
        "Keep your chest up and back straight",
        "Push through your heels",
        "Keep knees in line with toes",
      ],
      formFeedback: {
        good: "Great depth and posture!",
        medium: "Watch your knee alignment with your toes.",
        bad: "Your knees are going too far forward. Sit back more.",
      },
      musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
      difficulty: "Beginner",
      caloriesPerRep: 0.7,
    },
    shoulderPress: {
      name: "Shoulder Press",
      downAngle: 160,
      upAngle: 50,
      invertStages: false,
      isVertical: true,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      instructions:
        "Start with weights at shoulder level, press overhead until arms are fully extended.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#9C27B0",
      icon: "fitness_center",
      tips: [
        "Keep your core engaged and back straight",
        "Don't lock your elbows at the top",
        "Breathe out as you press up",
      ],
      formFeedback: {
        good: "Great shoulder alignment and full extension!",
        medium: "Try to keep your wrists straighter during the press.",
        bad: "You're arching your back. Engage your core more.",
      },
      musclesWorked: ["Shoulders", "Triceps", "Upper Back"],
      difficulty: "Intermediate",
      caloriesPerRep: 0.6,
    },
    lateralRaise: {
      name: "Lateral Raises",
      downAngle: 160,
      upAngle: 70,
      invertStages: false,
      isVertical: false,
      joints: {
        shoulder: 11,
        elbow: 13,
        wrist: 15,
      },
      instructions: "Stand with weights by your sides, raise them out to shoulder height with slightly bent elbows.",
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#E91E63",
      icon: "fitness_center",
      tips: [
        "Maintain a slight bend in your elbows",
        "Raise to shoulder height at maximum",
        "Control the motion both up and down",
      ],
      formFeedback: {
        good: "Perfect shoulder height and control!",
        medium: "Try to keep the weights more to your side, not front.",
        bad: "You're swinging too much. Use less weight and control the motion.",
      },
      musclesWorked: ["Side Deltoids", "Trapezius"],
      difficulty: "Beginner",
      caloriesPerRep: 0.4,
    },
    lunges: {
      name: "Lunges",
      downAngle: 90,
      upAngle: 160,
      invertStages: true,
      isVertical: true,
      joints: {
        hip: 23,
        knee: 25,
        ankle: 27,
      },
      instructions: "Step forward with one leg, lower your hips until both knees are bent at 90 degrees.",
      image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      color: "#00BCD4",
      icon: "directions_run",
      tips: [
        "Keep your upper body straight",
        "Step far enough forward that your knee stays behind your toes",
        "Keep your weight in your heels",
      ],
      formFeedback: {
        good: "Great depth and alignment!",
        medium: "Try to keep your front knee behind your toes.",
        bad: "Your torso is leaning too far forward. Stay upright.",
      },
      musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
      difficulty: "Intermediate",
      caloriesPerRep: 0.65,
    },
  };

  useEffect(() => {
    const loadMediaPipeScripts = async () => {
      try {
        setIsLoading(true);
        // Load MediaPipe scripts
        const loadScript = (src) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        await Promise.all([
          loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js"),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1632432234/camera_utils.js"
          ),
        ]);

        // Wait a bit to ensure scripts are initialized
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsMediaPipeLoaded(true);
        setIsLoading(false);
        setNotification({
          open: true,
          message: "AI pose detection ready! Start your workout.",
          color: "success"
        });
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
        setError("Failed to load pose detection libraries. Please refresh the page.");
        setIsLoading(false);
      }
    };

    loadMediaPipeScripts();
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      if (!isMediaPipeLoaded) {
        throw new Error("MediaPipe libraries are still loading. Please wait a moment.");
      }

      if (!window.Pose) {
        throw new Error("MediaPipe Pose is not loaded properly. Please refresh the page.");
      }

      // First check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Your browser doesn't support camera access. Please try using a modern browser."
        );
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
        throw new Error("Failed to get camera stream. Please check your camera permissions.");
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
              reject(new Error("Error loading video: " + error.message));
            };
          }
        });
      }

      // Initialize MediaPipe Pose if not already initialized
      if (!poseRef.current) {
        const pose = new window.Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
          },
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          selfieMode: cameraFacingRef.current === "user",
        });

        pose.onResults((results) => {
          if (results.poseLandmarks) {
            const landmarks = results.poseLandmarks;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const video = videoRef.current;

            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Clear canvas and prepare for drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Apply mirroring if using front camera (selfie mode)
            if (cameraFacingRef.current === "user") {
              ctx.save();
              ctx.scale(-1, 1);
              ctx.translate(-canvas.width, 0);
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              ctx.restore();
            } else {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            // Get the selected exercise data
            const exerciseData = exercises[selectedExercise];
            
            // Get joint indices from the selected exercise
            const { shoulder, elbow, wrist } = exerciseData.joints;
            
            // Get landmarks for the selected joints
            const joint1 = shoulder ? [landmarks[shoulder].x, landmarks[shoulder].y] : null;
            const joint2 = elbow ? [landmarks[elbow].x, landmarks[elbow].y] : null;
            const joint3 = wrist ? [landmarks[wrist].x, landmarks[wrist].y] : null;
            
            // Calculate angle if all necessary joints are detected
            let angle = null;
            if (joint1 && joint2 && joint3) {
              angle = Math.atan2(joint3[1] - joint2[1], joint3[0] - joint2[0]) -
                      Math.atan2(joint1[1] - joint2[1], joint1[0] - joint2[0]);
              angle = Math.abs((angle * 180.0) / Math.PI);
              
              if (angle > 180.0) {
                angle = 360 - angle;
              }
              
              // Update accuracy score based on current angle
              updateAccuracyScore(angle, selectedExercise);
              
              // Rep counting logic based on the selected exercise
              const { downAngle, upAngle, invertStages } = exerciseData;
              
              if (invertStages) {
                // For exercises like squats and push-ups where "down" is the active position
                if (angle < upAngle) {
                  stageRef.current = "DOWN";
                  setDisplayStage("DOWN");
                }
                if (angle > downAngle && stageRef.current === "DOWN") {
                  stageRef.current = "UP";
                  setDisplayStage("UP");
                  counterRef.current += 1;
                  setDisplayCounter(counterRef.current);
                  if (counterRef.current >= targetReps) {
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 3000);
                  }
                }
              } else {
                // For exercises like bicep curls where "up" is the active position
                if (angle > downAngle) {
                  stageRef.current = "DOWN";
                  setDisplayStage("DOWN");
                }
                if (angle < upAngle && stageRef.current === "DOWN") {
                  stageRef.current = "UP";
                  setDisplayStage("UP");
                  counterRef.current += 1;
                  setDisplayCounter(counterRef.current);
                  if (counterRef.current >= targetReps) {
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 3000);
                  }
                }
              }
            }
            
            // Draw landmarks and connectors if enabled
            if (showLandmarksRef.current) {
              console.log("Drawing landmarks");
              window.drawLandmarks(ctx, results.poseLandmarks, {
                color: "#F542E6",
                lineWidth: 2,
                radius: 4,
              });
            }
            
            if (showConnectorsRef.current) {
              console.log("Drawing connectors");
              window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
                color: "#F57542",
                lineWidth: 2,
              });
            }
            
            // Draw counter, stage, and form feedback
            ctx.save();
            
            // Draw stats container
            if (showStatsRef.current) {
              // Draw the stats container
              const statsX = cameraFacingRef.current === "user" ? canvas.width - 310 : 10;
              ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
              ctx.fillRect(statsX, 10, 300, 120);
              ctx.fillStyle = "white";
              
              // Draw exercise name
              ctx.font = "bold 20px Arial";
              ctx.fillText(exerciseData.name, statsX + 10, 35);
              
              // Draw rep counter with target
              ctx.font = "16px Arial";
              ctx.fillText(`REPS: ${counterRef.current}/${targetReps}`, statsX + 10, 65);
              
              // Draw progress bar for rep target
              const progressWidth = 280;
              const progress = Math.min(counterRef.current / targetReps, 1) * progressWidth;
              ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
              ctx.fillRect(statsX + 10, 75, progressWidth, 10);
              ctx.fillStyle = exerciseData.color || "#4CAF50";
              ctx.fillRect(statsX + 10, 75, progress, 10);
              
              // Draw current stage
              ctx.fillStyle = "white";
              ctx.font = "16px Arial";
              ctx.fillText(`STAGE: ${stageRef.current || "Ready"}`, statsX + 170, 65);
              
              // Draw accuracy score
              ctx.fillText(`ACCURACY: ${accuracyScore}%`, statsX + 10, 105);
              
              // Draw form feedback if available
              if (angle && stageRef.current) {
                const feedback = getFormFeedback(angle, selectedExercise);
                if (feedback) {
                  ctx.font = "16px Arial";
                  ctx.fillText(`FEEDBACK: ${feedback}`, statsX + 10, 130);
                }
              }
            }
            
            // Draw angle on the joint if enabled
            if (showAnglesRef.current && angle && joint2) {
              ctx.fillStyle = "white";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 2;
              ctx.font = "bold 16px Arial";
              const text = `${Math.round(angle)}°`;
              
              // Calculate text position based on joint position
              const jointX = joint2[0] * canvas.width;
              const jointY = joint2[1] * canvas.height;
              
              // Draw text with outline
              ctx.strokeText(text, jointX, jointY);
              ctx.fillText(text, jointX, jointY);
            }
            
            // Draw instruction
            if (stageRef.current && showInstructionsRef.current) {
              const instruction = stageRef.current === "DOWN" ? "GO UP!" : "GO DOWN!";
              const instructionColor = stageRef.current === "DOWN" ? "#4CAF50" : "#FFC107";
              
              // Position at bottom center
              ctx.textAlign = "center";
              ctx.font = "bold 32px Arial";
              ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
              ctx.fillRect(canvas.width / 2 - 100, canvas.height - 60, 200, 50);
              
              // Draw instruction text
              ctx.fillStyle = instructionColor;
              ctx.fillText(instruction, canvas.width / 2, canvas.height - 25);
              
              // Reset text alignment
              ctx.textAlign = "left";
            }
            
            ctx.restore();
          }
        });

        poseRef.current = pose;
      }

      // Start processing frames
      const processFrame = async () => {
        if (
          videoRef.current && 
          videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && 
          !isPaused
        ) {
          await poseRef.current.send({ image: videoRef.current });
        }
        requestAnimationFrame(processFrame);
      };

      processFrame();
      setIsCameraActive(true);
      setError(null);
      setWorkoutStartTime(new Date());
      
      setNotification({
        open: true,
        message: "Camera started. Begin your workout!",
        color: "success"
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Error accessing camera. ";
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage += "Please grant camera permissions in your browser settings. ";
        errorMessage += "Click the camera icon in your browser's address bar and allow access.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera found. Please connect a camera and try again.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage +=
          "Camera is in use by another application. Please close other apps using the camera.";
      } else {
        errorMessage += error.message || "Please try refreshing the page.";
      }
      setError(errorMessage);
      setIsCameraActive(false);
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
      console.log("Closing MediaPipe Pose instance");
      try {
        poseRef.current.close();
      } catch (e) {
        console.error("Error closing pose:", e);
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
  };
  
  const toggleCameraFacing = async () => {
    if (isCameraActive) {
      stopCamera();
      // Wait for camera to fully stop
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const newFacing = cameraFacingRef.current === "user" ? "environment" : "user";
    console.log("Toggling camera facing to:", newFacing);
    setCameraFacing(newFacing);
    
    if (isCameraActive) {
      // Give more time for state to update
      setTimeout(() => {
        console.log("Starting camera with facing:", cameraFacingRef.current);
        startCamera();
      }, 1000);
    }
  };
  
  const pauseResumeCamera = () => {
    setIsPaused(prev => !prev);
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
      weight: currentWeight || "Not specified",
      accuracy: accuracyScore,
    };
    
    const updatedHistory = [workout, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('postureSenseHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving workout history:", error);
    }
    
    setNotification({
      open: true,
      message: "Workout saved successfully!",
      color: "success"
    });
  };
  
  const resetWorkout = () => {
    counterRef.current = 0;
    stageRef.current = null;
    setDisplayCounter(0);
    setDisplayStage(null);
    setAccuracyScore(0);
    setShowCelebration(false);
    setWorkoutDuration(0);
    setCaloriesBurned(0);
    
    setNotification({
      open: true,
      message: "Workout reset. Ready to start!",
      color: "info",
    });
  };
  
  const toggleFullscreen = () => {
    const container = document.getElementById("posture-sense-container");
    
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
    const targetAngle = stageRef.current === "DOWN" ? downAngle : upAngle;
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
    const targetAngle = stageRef.current === "DOWN" ? targetExercise.downAngle : targetExercise.upAngle;
    const difference = Math.abs(angle - targetAngle);
    
    // Calculate accuracy as a percentage (100% when difference is 0, 0% when difference is 90 or more)
    const accuracy = Math.max(0, 100 - (difference / 90) * 100);
    
    // Update accuracy score (weighted average)
    setAccuracyScore(prev => {
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
      console.error("Error loading workout history:", error);
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {/* Notification component */}
      <MDSnackbar
        color={notification.color}
        icon="notifications"
        title="FitVice AI"
        content={notification.message}
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        close
        autoHideDuration={5000}
      />
      
      {/* Main content */}
      <MDBox
        id="posture-sense-container"
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isFullscreen ? 0 : "2rem",
          borderRadius: isFullscreen ? 0 : "1rem",
          boxShadow: isFullscreen ? "none" : "0 4px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "white",
          overflow: "hidden",
          minHeight: "80vh",
          transition: "all 0.3s ease",
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 0 : "auto",
          left: isFullscreen ? 0 : "auto",
          right: isFullscreen ? 0 : "auto",
          bottom: isFullscreen ? 0 : "auto",
          zIndex: isFullscreen ? 9999 : 1,
          width: isFullscreen ? "100vw" : "auto",
          height: isFullscreen ? "100vh" : "auto",
        }}
      >
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tabs navigation */}
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                backgroundColor: "#f5f5f5", 
                borderRadius: "8px",
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: "info.main",
                  height: "4px",
                  borderRadius: "4px 4px 0 0",
                },
              }}
            >
              <Tab 
                label="Workout" 
                icon={<FitnessCenterIcon />} 
                iconPosition="start"
                sx={{ fontWeight: activeTab === 0 ? "bold" : "normal" }}
              />
              <Tab 
                label="History" 
                icon={<HistoryIcon />} 
                iconPosition="start"
                sx={{ fontWeight: activeTab === 1 ? "bold" : "normal" }}
              />
              <Tab 
                label="Settings" 
                icon={<SettingsIcon />} 
                iconPosition="start"
                sx={{ fontWeight: activeTab === 2 ? "bold" : "normal" }}
              />
            </Tabs>
            
            {/* Workout Tab */}
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MDBox mb={3}>
                  <MDTypography variant="h4" color="dark" align="center" gutterBottom fontWeight="bold">
                    AI Posture Sense
                  </MDTypography>
                  <MDTypography variant="body2" color="text" align="center" mb={2}>
                    Select an exercise, set your goals, and let our AI track your form and count your reps!
                  </MDTypography>
                </MDBox>
                
                {/* Exercise selection */}
                <MDBox mb={4}>
                  <MDTypography variant="h6" color="dark" mb={2}>
                    Choose Exercise
                  </MDTypography>
                  <Grid container spacing={2}>
                    {Object.keys(exercises).map((key) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Card
                          onClick={() => setSelectedExercise(key)}
                          sx={{
                            cursor: "pointer",
                            transform: selectedExercise === key ? "scale(1.02)" : "scale(1)",
                            transition: "transform 0.3s ease",
                            border: selectedExercise === key ? `2px solid ${exercises[key].color}` : "none",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: selectedExercise === key ? "0 8px 16px rgba(0,0,0,0.1)" : "0 4px 6px rgba(0,0,0,0.05)",
                          }}
                        >
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="140"
                              image={exercises[key].image}
                              alt={exercises[key].name}
                              sx={{ 
                                filter: selectedExercise !== key ? "grayscale(50%)" : "none",
                                transition: "filter 0.3s ease",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: exercises[key].color || "primary.main",
                                color: "white",
                                padding: "4px 10px",
                                display: "flex",
                                alignItems: "center",
                                opacity: 0.9,
                              }}
                            >
                              <Icon sx={{ mr: 1 }}>{exercises[key].icon}</Icon>
                              {exercises[key].name}
                            </Box>
                            <CardContent>
                              <MDTypography variant="caption" color="text">
                                {exercises[key].instructions}
                              </MDTypography>
                              <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                                {exercises[key].musclesWorked.map(muscle => (
                                  <Chip
                                    key={muscle}
                                    label={muscle}
                                    size="small"
                                    sx={{ 
                                      fontSize: "0.65rem", 
                                      height: "20px",
                                      backgroundColor: `${exercises[key].color}20`, // 20% opacity of the exercise color
                                      color: exercises[key].color,
                                    }}
                                  />
                                ))}
                              </Box>
                              <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Chip
                                  label={exercises[key].difficulty}
                                  size="small"
                                  sx={{ 
                                    fontSize: "0.65rem", 
                                    height: "20px",
                                    backgroundColor: exercises[key].difficulty === "Beginner" 
                                      ? "#4caf5020" 
                                      : exercises[key].difficulty === "Intermediate" 
                                        ? "#ff980020" 
                                        : "#f4433620",
                                    color: exercises[key].difficulty === "Beginner" 
                                      ? "#4caf50" 
                                      : exercises[key].difficulty === "Intermediate" 
                                        ? "#ff9800" 
                                        : "#f44336",
                                  }}
                                />
                                <MDTypography variant="caption" fontWeight="light">
                                  ~ {exercises[key].caloriesPerRep} cal/rep
                                </MDTypography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
                
                {/* Workout settings */}
                <MDBox mb={3}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <MDInput
                        label="Target Reps"
                        type="number"
                        value={targetReps}
                        onChange={(e) => setTargetReps(Number(e.target.value))}
                        fullWidth
                        InputProps={{
                          startAdornment: <Icon sx={{ mr: 1 }}>fitness_center</Icon>,
                        }}
                        min={1}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <MDInput
                        label="Your Weight (kg)"
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        fullWidth
                        InputProps={{
                          startAdornment: <Icon sx={{ mr: 1 }}>monitor_weight</Icon>,
                        }}
                        min={1}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MDButton
                        variant="contained"
                        color={isCameraActive ? "error" : "success"}
                        onClick={isCameraActive ? stopCamera : startCamera}
                        fullWidth
                        disabled={isLoading}
                        startIcon={isCameraActive ? <CameraIcon /> : <CameraAltIcon />}
                      >
                        {isLoading ? "Loading..." : isCameraActive ? "Stop Camera" : "Start Camera"}
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
                
                {/* Camera view and workout stats */}
                <MDBox mb={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      {/* Camera container */}
                      <MDBox
                        sx={{
                          position: "relative",
                          width: "100%",
                          borderRadius: "1rem",
                          overflow: "hidden",
                          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                          backgroundColor: "#000",
                          aspectRatio: "4/3",
                        }}
                      >
                        {/* Video is hidden but used for capturing */}
                        <video
                          ref={videoRef}
                          style={{
                            display: "none",
                          }}
                        />
                        
                        {/* Canvas shows the video with pose detection */}
                        <canvas
                          ref={canvasRef}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        
                        {/* Loading overlay */}
                        {isLoading && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              zIndex: 2,
                            }}
                          >
                            <CircularProgress color="info" size={60} thickness={5} />
                            <MDTypography color="white" variant="h6" mt={2}>
                              Initializing AI...
                            </MDTypography>
                          </Box>
                        )}
                        
                        {/* Camera controls overlay */}
                        {isCameraActive && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 10,
                              left: 0,
                              right: 0,
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                              zIndex: 1,
                            }}
                          >
                            <IconButton 
                              onClick={toggleFullscreen}
                              sx={{ 
                                backgroundColor: "rgba(0, 0, 0, 0.6)", 
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                }
                              }}
                            >
                              <Icon>{isFullscreen ? "fullscreen_exit" : "fullscreen"}</Icon>
                            </IconButton>
                            
                            <IconButton 
                              onClick={toggleCameraFacing}
                              sx={{ 
                                backgroundColor: "rgba(0, 0, 0, 0.6)", 
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                }
                              }}
                            >
                              <FlipCameraAndroidIcon />
                            </IconButton>
                            
                            <IconButton 
                              onClick={pauseResumeCamera}
                              sx={{ 
                                backgroundColor: "rgba(0, 0, 0, 0.6)", 
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                }
                              }}
                            >
                              <Icon>{isPaused ? "play_arrow" : "pause"}</Icon>
                            </IconButton>
                            
                            <IconButton 
                              onClick={resetWorkout}
                              sx={{ 
                                backgroundColor: "rgba(0, 0, 0, 0.6)", 
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                }
                              }}
                            >
                              <RestartAltIcon />
                            </IconButton>
                          </Box>
                        )}
                        
                        {/* Instructions overlay for inactive camera */}
                        {!isCameraActive && !isLoading && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              padding: 3,
                              textAlign: "center",
                            }}
                          >
                            <CameraAltIcon sx={{ fontSize: 60, color: "white", mb: 2 }} />
                            <MDTypography color="white" variant="h5" fontWeight="bold" mb={1}>
                              Start Your AI Workout
                            </MDTypography>
                            <MDTypography color="white" variant="body2" mb={3}>
                              Select an exercise, set your targets, and click "Start Camera" to begin tracking your workout with AI.
                            </MDTypography>
                            <MDButton
                              variant="contained"
                              color="info"
                              onClick={startCamera}
                              disabled={isLoading}
                              startIcon={<CameraAltIcon />}
                              sx={{ borderRadius: "30px", px: 3 }}
                            >
                              Start Camera
                            </MDButton>
                          </Box>
                        )}
                      </MDBox>
                    </Grid>
                    
                    {/* Workout stats and tips panel */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: "100%", overflow: "auto", maxHeight: "500px" }}>
                        <MDBox p={2}>
                          <MDTypography variant="h6" color="dark" mb={2} display="flex" alignItems="center">
                            <Icon sx={{ mr: 1 }}>{exercises[selectedExercise].icon}</Icon>
                            {exercises[selectedExercise].name}
                          </MDTypography>
                          
                          {/* Stats */}
                          {isCameraActive && (
                            <MDBox mb={3}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <MDBox textAlign="center" p={1} bgcolor="grey.100" borderRadius="md">
                                    <MDTypography variant="body2" color="text">Reps</MDTypography>
                                    <MDTypography variant="h4" color="info">{displayCounter}</MDTypography>
                                    <MDBox mt={1}>
                                      <MDProgress variant="gradient" color="info" value={Math.min((displayCounter / targetReps) * 100, 100)} />
                                    </MDBox>
                                  </MDBox>
                                </Grid>
                                <Grid item xs={6}>
                                  <MDBox textAlign="center" p={1} bgcolor="grey.100" borderRadius="md">
                                    <MDTypography variant="body2" color="text">Accuracy</MDTypography>
                                    <MDTypography variant="h4" color={
                                      accuracyScore >= 80 ? "success" : 
                                      accuracyScore >= 60 ? "warning" : 
                                      "error"
                                    }>
                                      {accuracyScore}%
                                    </MDTypography>
                                    <MDBox mt={1}>
                                      <MDProgress variant="gradient" color={
                                        accuracyScore >= 80 ? "success" : 
                                        accuracyScore >= 60 ? "warning" : 
                                        "error"
                                      } value={accuracyScore} />
                                    </MDBox>
                                  </MDBox>
                                </Grid>
                                <Grid item xs={6}>
                                  <MDBox textAlign="center" p={1} bgcolor="grey.100" borderRadius="md">
                                    <MDTypography variant="body2" color="text">Duration</MDTypography>
                                    <MDTypography variant="h5" color="dark">
                                      {workoutDuration ? 
                                        `${Math.floor(workoutDuration / 60)}:${(workoutDuration % 60).toString().padStart(2, '0')}` : 
                                        "0:00"}
                                    </MDTypography>
                                  </MDBox>
                                </Grid>
                                <Grid item xs={6}>
                                  <MDBox textAlign="center" p={1} bgcolor="grey.100" borderRadius="md">
                                    <MDTypography variant="body2" color="text">Calories</MDTypography>
                                    <MDTypography variant="h5" color="dark">{caloriesBurned}</MDTypography>
                                  </MDBox>
                                </Grid>
                              </Grid>
                            </MDBox>
                          )}
                          
                          {/* Exercise tips */}
                          <MDBox>
                            <MDTypography variant="subtitle2" color="dark" fontWeight="medium" mb={2} display="flex" alignItems="center">
                              <InfoIcon sx={{ fontSize: 20, mr: 1 }} />
                              Form Tips
                            </MDTypography>
                            <MDBox component="ul" p={0} m={0} sx={{ listStylePosition: "inside" }}>
                              {exercises[selectedExercise].tips.map((tip, index) => (
                                <MDTypography
                                  key={index}
                                  component="li" 
                                  variant="body2" 
                                  color="text"
                                  mb={1}
                                  sx={{ display: "flex", alignItems: "flex-start" }}
                                >
                                  <CheckCircleIcon sx={{ fontSize: 16, mr: 1, mt: 0.5, color: exercises[selectedExercise].color }} />
                                  {tip}
                                </MDTypography>
                              ))}
                            </MDBox>
                          </MDBox>
                          
                          {/* Display controls */}
                          <MDBox mt={2}>
                            <Divider />
                            <MDTypography variant="subtitle2" color="dark" fontWeight="medium" my={2}>
                              Display Options
                            </MDTypography>
                            <FormControlLabel
                              control={
                                <Switch 
                                  key={`landmarks-${showLandmarks}`}
                                  checked={showLandmarks} 
                                  onChange={(e) => {
                                    console.log("Landmarks switch changed:", e.target.checked);
                                    setShowLandmarks(e.target.checked);
                                  }}
                                  color="info"
                                />
                              }
                              label="Show Landmarks"
                            />
                            <FormControlLabel
                              control={
                                <Switch 
                                  key={`connectors-${showConnectors}`}
                                  checked={showConnectors} 
                                  onChange={(e) => {
                                    console.log("Connectors switch changed:", e.target.checked);
                                    setShowConnectors(e.target.checked);
                                  }}
                                  color="info"
                                />
                              }
                              label="Show Skeleton"
                            />
                            <FormControlLabel
                              control={
                                <Switch 
                                  key={`angles-${showAngles}`}
                                  checked={showAngles} 
                                  onChange={(e) => {
                                    console.log("Angles switch changed:", e.target.checked);
                                    setShowAngles(e.target.checked);
                                  }}
                                  color="info"
                                />
                              }
                              label="Show Angles"
                            />
                            <FormControlLabel
                              control={
                                <Switch 
                                  key={`stats-${showStats}`}
                                  checked={showStats} 
                                  onChange={(e) => {
                                    console.log("Stats switch changed:", e.target.checked);
                                    setShowStats(e.target.checked);
                                  }}
                                  color="info"
                                />
                              }
                              label="Show Stats Overlay"
                            />
                          </MDBox>
                          
                          {/* Save workout button */}
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
                </MDBox>
                
                {/* Celebration modal */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      <MDBox
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "1rem",
                          padding: "2rem",
                          textAlign: "center",
                          maxWidth: "400px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "6px",
                            background: `linear-gradient(90deg, ${exercises[selectedExercise].color} 0%, #4CAF50 100%)`,
                          }}
                        />
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Icon sx={{ fontSize: 60, color: exercises[selectedExercise].color }}>
                            emoji_events
                          </Icon>
                          <MDTypography variant="h4" color="dark" mt={2} mb={1}>
                            Congratulations! 🎉
                          </MDTypography>
                          <MDTypography variant="body1" color="text" mb={2}>
                            You've exceeded your target of {targetReps} reps!
                          </MDTypography>
                          <MDTypography variant="h5" color="success" mb={3}>
                            New Personal Record!
                          </MDTypography>
                          <Grid container spacing={2} mb={2}>
                            <Grid item xs={6}>
                              <MDBox bgcolor="grey.100" p={1} borderRadius="md">
                                <MDTypography variant="body2">Total Reps</MDTypography>
                                <MDTypography variant="h4" color="info">{displayCounter}</MDTypography>
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox bgcolor="grey.100" p={1} borderRadius="md">
                                <MDTypography variant="body2">Calories</MDTypography>
                                <MDTypography variant="h4" color="info">{caloriesBurned}</MDTypography>
                              </MDBox>
                            </Grid>
                          </Grid>
                          <MDButton
                            variant="gradient"
                            color="success"
                            onClick={() => {
                              setShowCelebration(false);
                              saveWorkout();
                            }}
                          >
                            Save Workout
                          </MDButton>
                        </motion.div>
                      </MDBox>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* History Tab */}
            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MDBox mb={3}>
                  <MDTypography variant="h4" color="dark" align="center" gutterBottom fontWeight="bold">
                    Workout History
                  </MDTypography>
                  <MDTypography variant="body2" color="text" align="center" mb={2}>
                    Track your progress and see your workout statistics over time.
                  </MDTypography>
                </MDBox>

                {workoutHistory.length === 0 ? (
                  <MDBox 
                    sx={{ 
                      textAlign: "center", 
                      py: 5, 
                      backgroundColor: "grey.100", 
                      borderRadius: "1rem",
                      mb: 3 
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <MDTypography variant="h5" color="dark" gutterBottom>
                      No Workout History Yet
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Complete your first workout to start tracking your progress!
                    </MDTypography>
                    <MDButton 
                      variant="outlined" 
                      color="info" 
                      sx={{ mt: 2 }}
                      onClick={() => setActiveTab(0)}
                    >
                      Start a Workout
                    </MDButton>
                  </MDBox>
                ) : (
                  <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} mb={4}>
                      {/* Weekly Progress Summary Card */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <MDBox p={3}>
                            <MDTypography variant="h6" color="dark" mb={3} display="flex" alignItems="center">
                              <BarChartIcon sx={{ mr: 1 }} />
                              Weekly Progress Summary
                            </MDTypography>
                            
                            {/* Chart.js Line Chart */}
                            <MDBox sx={{ height: "250px" }}>
                              <Line
                                data={{
                                  labels: [...Array(7)].map((_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() - i);
                                    return formatDate(date, "EEE");
                                  }).reverse(),
                                  datasets: [{
                                    label: "Reps",
                                    data: [...Array(7)].map((_, i) => {
                                      const date = new Date();
                                      date.setDate(date.getDate() - i);
                                      const dateStr = formatDate(date, "yyyy-MM-dd");
                                      return workoutHistory
                                        .filter(w => formatDate(new Date(w.date), "yyyy-MM-dd") === dateStr)
                                        .reduce((total, w) => total + w.reps, 0);
                                    }).reverse(),
                                    borderColor: "#2196F3",
                                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                                    fill: true,
                                    tension: 0.4,
                                  }]
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                    tooltip: {
                                      mode: "index",
                                      intersect: false,
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      grid: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.05)",
                                      },
                                    },
                                    x: {
                                      grid: {
                                        display: false,
                                      },
                                    },
                                  },
                                }}
                              />
                            </MDBox>
                          </MDBox>
                        </Card>
                      </Grid>

                      {/* Calories & Duration Bar Chart */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <MDBox p={3}>
                            <MDTypography variant="h6" color="dark" mb={3} display="flex" alignItems="center">
                              <LocalFireDepartmentIcon sx={{ mr: 1 }} />
                              Calories & Duration
                            </MDTypography>
                            
                            {/* Chart.js Bar Chart */}
                            <MDBox sx={{ height: "250px" }}>
                              <Bar
                                data={{
                                  labels: [...Array(5)].map((_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() - i);
                                    return formatDate(date, "MMM dd");
                                  }).reverse(),
                                  datasets: [
                                    {
                                      label: "Calories",
                                      data: [...Array(5)].map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() - i);
                                        const dateStr = formatDate(date, "yyyy-MM-dd");
                                        return workoutHistory
                                          .filter(w => formatDate(new Date(w.date), "yyyy-MM-dd") === dateStr)
                                          .reduce((total, w) => total + w.calories, 0);
                                      }).reverse(),
                                      backgroundColor: "rgba(244, 67, 54, 0.7)",
                                    },
                                    {
                                      label: "Minutes",
                                      data: [...Array(5)].map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() - i);
                                        const dateStr = formatDate(date, "yyyy-MM-dd");
                                        return workoutHistory
                                          .filter(w => formatDate(new Date(w.date), "yyyy-MM-dd") === dateStr)
                                          .reduce((total, w) => total + Math.floor(w.duration / 60), 0);
                                      }).reverse(),
                                      backgroundColor: "rgba(33, 150, 243, 0.7)",
                                    }
                                  ]
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: "top",
                                    },
                                    tooltip: {
                                      mode: "index",
                                      intersect: false,
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      grid: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.05)",
                                      },
                                    },
                                    x: {
                                      grid: {
                                        display: false,
                                      },
                                    },
                                  },
                                }}
                              />
                            </MDBox>
                          </MDBox>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    {/* Workout History List */}
                    <MDTypography variant="h6" color="dark" mb={2}>
                      Recent Workouts
                    </MDTypography>
                    
                    <MDBox sx={{ maxHeight: "400px", overflow: "auto" }}>
                      {workoutHistory.map((workout, index) => (
                        <Card key={workout.id} sx={{ mb: 2, overflow: "hidden" }}>
                          <MDBox 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              p: 2,
                              borderLeft: `4px solid ${
                                workout.exercise.includes("Bicep") ? "#4CAF50" :
                                workout.exercise.includes("Push") ? "#2196F3" :
                                workout.exercise.includes("Squat") ? "#FF9800" :
                                workout.exercise.includes("Shoulder") ? "#9C27B0" :
                                workout.exercise.includes("Lateral") ? "#E91E63" :
                                "#00BCD4"
                              }`
                            }}
                          >
                            <MDAvatar 
                              src={exercises[Object.keys(exercises).find(key => 
                                exercises[key].name === workout.exercise
                              )]?.image}
                              alt={workout.exercise}
                              size="lg"
                              sx={{ mr: 2 }}
                            />
                            
                            <MDBox sx={{ flexGrow: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                  <MDTypography variant="subtitle2" fontWeight="medium">
                                    {workout.exercise}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text">
                                    {new Date(workout.date).toLocaleDateString()} at {new Date(workout.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </MDTypography>
                                </Grid>
                                
                                <Grid item xs={6} sm={3} md={2}>
                                  <MDTypography variant="body2" fontWeight="bold">
                                    Reps
                                  </MDTypography>
                                  <MDTypography variant="body2">
                                    {workout.reps}/{workout.targetReps}
                                  </MDTypography>
                                </Grid>
                                
                                <Grid item xs={6} sm={3} md={2}>
                                  <MDTypography variant="body2" fontWeight="bold">
                                    Duration
                                  </MDTypography>
                                  <MDTypography variant="body2">
                                    {Math.floor(workout.duration / 60)}:{(workout.duration % 60).toString().padStart(2, "0")}
                                  </MDTypography>
                                </Grid>
                                
                                <Grid item xs={6} sm={3} md={2}>
                                  <MDTypography variant="body2" fontWeight="bold">
                                    Calories
                                  </MDTypography>
                                  <MDTypography variant="body2">
                                    {workout.calories}
                                  </MDTypography>
                                </Grid>
                                
                                <Grid item xs={6} sm={3} md={2}>
                                  <MDTypography variant="body2" fontWeight="bold">
                                    Accuracy
                                  </MDTypography>
                                  <MDBox sx={{ display: "flex", alignItems: "center" }}>
                                    <MDProgress
                                      value={workout.accuracy || 0}
                                      color={
                                        (workout.accuracy || 0) >= 80 ? "success" : 
                                        (workout.accuracy || 0) >= 60 ? "warning" : 
                                        "error"
                                      }
                                      sx={{ flexGrow: 1, mr: 1 }}
                                    />
                                    <MDTypography variant="caption">
                                      {workout.accuracy || 0}%
                                    </MDTypography>
                                  </MDBox>
                                </Grid>
                                
                                <Grid item xs={6} sm={3} md={1}>
                                  <MDTypography variant="body2" fontWeight="bold">
                                    Weight
                                  </MDTypography>
                                  <MDTypography variant="body2">
                                    {workout.weight}
                                  </MDTypography>
                                </Grid>
                              </Grid>
                            </MDBox>
                            
                            <MDBox>
                              <IconButton onClick={() => {
                                const updatedHistory = [...workoutHistory];
                                updatedHistory.splice(index, 1);
                                setWorkoutHistory(updatedHistory);
                                localStorage.setItem("postureSenseHistory", JSON.stringify(updatedHistory));
                              }}>
                                <Icon color="error">delete</Icon>
                              </IconButton>
                            </MDBox>
                          </MDBox>
                        </Card>
                      ))}
                    </MDBox>
                    
                    {workoutHistory.length > 0 && (
                      <MDBox textAlign="center" mt={3}>
                        <MDButton 
                          variant="outlined" 
                          color="error"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to clear all workout history?")) {
                              setWorkoutHistory([]);
                              localStorage.removeItem("postureSenseHistory");
                              setNotification({
                                open: true,
                                message: "Workout history cleared",
                                color: "info"
                              });
                            }
                          }}
                        >
                          Clear History
                        </MDButton>
                      </MDBox>
                    )}
                  </>
                )}
              </motion.div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MDBox mb={3}>
                  <MDTypography variant="h4" color="dark" align="center" gutterBottom fontWeight="bold">
                    Exercise Guide
                  </MDTypography>
                  <MDTypography variant="body2" color="text" align="center" mb={2}>
                    Learn how to perform exercises with proper form
                  </MDTypography>
                </MDBox>
                
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" color="dark" mb={3}>
                      {exercises[selectedExercise].name}
                    </MDTypography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDBox 
                          component="img"
                          src={exercises[selectedExercise].image}
                          alt={exercises[selectedExercise].name}
                          borderRadius="lg"
                          shadow="md"
                          width="100%"
                          height="auto"
                          maxHeight="300px"
                          mb={2}
                          sx={{ objectFit: "cover" }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="body2" color="text" mb={2}>
                          {exercises[selectedExercise].instructions}
                        </MDTypography>
                        
                        <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                          Form Tips:
                        </MDTypography>
                        
                        <List dense>
                          {exercises[selectedExercise].tips.map((tip, index) => (
                            <ListItem key={index} disableGutters>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon sx={{ color: exercises[selectedExercise].color, fontSize: 18 }} />
                              </ListItemIcon>
                              <ListItemText primary={<MDTypography variant="body2">{tip}</MDTypography>} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
                
                <MDBox mt={3}>
                  <Card>
                    <MDBox p={3}>
                      <MDTypography variant="h6" color="dark" mb={3}>
                        Display Settings
                      </MDTypography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch 
                                key={`landmarks-${showLandmarks}`}
                                checked={showLandmarks} 
                                onChange={(e) => {
                                  console.log("Landmarks switch changed:", e.target.checked);
                                  setShowLandmarks(e.target.checked);
                                }}
                                color="info"
                              />
                            }
                            label="Show Pose Landmarks"
                          />
                          
                          <FormControlLabel
                            control={
                              <Switch 
                                key={`connectors-${showConnectors}`}
                                checked={showConnectors} 
                                onChange={(e) => {
                                  console.log("Connectors switch changed:", e.target.checked);
                                  setShowConnectors(e.target.checked);
                                }}
                                color="info"
                              />
                            }
                            label="Show Connectors"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch 
                                key={`angles-${showAngles}`}
                                checked={showAngles} 
                                onChange={(e) => {
                                  console.log("Angles switch changed:", e.target.checked);
                                  setShowAngles(e.target.checked);
                                }}
                                color="info"
                              />
                            }
                            label="Show Joint Angles"
                          />
                          
                          <FormControlLabel
                            control={
                              <Switch 
                                key={`stats-${showStats}`}
                                checked={showStats} 
                                onChange={(e) => {
                                  console.log("Stats switch changed:", e.target.checked);
                                  setShowStats(e.target.checked);
                                }}
                                color="info"
                              />
                            }
                            label="Show Stats Overlay"
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </MDBox>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PostureSense;
