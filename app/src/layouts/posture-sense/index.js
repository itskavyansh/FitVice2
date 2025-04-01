/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Framer motion
import { motion } from "framer-motion";

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
    },
  };

  useEffect(() => {
    const loadMediaPipeScripts = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
        setError("Failed to load pose detection libraries. Please refresh the page.");
      }
    };

    loadMediaPipeScripts();
  }, []);

  const startCamera = async () => {
    try {
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
          facingMode: "user",
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

            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get coordinates
            const shoulder = [landmarks[11].x, landmarks[11].y];
            const elbow = [landmarks[13].x, landmarks[13].y];
            const wrist = [landmarks[15].x, landmarks[15].y];

            // Calculate angle
            let angle =
              Math.atan2(wrist[1] - elbow[1], wrist[0] - elbow[0]) -
              Math.atan2(shoulder[1] - elbow[1], shoulder[0] - elbow[0]);
            angle = Math.abs((angle * 180.0) / Math.PI);

            if (angle > 180.0) {
              angle = 360 - angle;
            }

            // Curl counter logic
            if (angle > 160) {
              stageRef.current = "DOWN";
              setDisplayStage("DOWN");
            }
            if (angle < 30 && stageRef.current === "DOWN") {
              stageRef.current = "UP";
              setDisplayStage("UP");
              counterRef.current += 1;
              setDisplayCounter(counterRef.current);

              // Check if target reps are exceeded
              if (counterRef.current > targetReps) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
              }
            }

            // Draw landmarks
            window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
              color: "#F57542",
              lineWidth: 2,
              radius: 2,
            });
            window.drawLandmarks(ctx, results.poseLandmarks, {
              color: "#F542E6",
              lineWidth: 2,
              radius: 2,
            });

            // Draw counter and stage overlay
            ctx.save(); // Save the current state
            ctx.scale(-1, 1); // Counter the mirror effect for text
            // Draw the background rectangle (adjusted for mirroring)
            ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
            ctx.fillRect(-250, 0, 250, 120); // Made taller for larger instruction text
            // Draw the text (adjusted for mirroring)
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("REPS", -230, 20);
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.fillText(counterRef.current.toString(), -225, 50);
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("STAGE", -150, 20);
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.fillText(stageRef.current || "", -150, 50);

            // Add instruction text with enhanced visibility
            const instruction = stageRef.current === "DOWN" ? "GO UP!" : "GO DOWN!";
            // Draw highlight background for instruction
            ctx.fillStyle =
              stageRef.current === "DOWN" ? "rgba(76, 175, 80, 0.3)" : "rgba(255, 193, 7, 0.3)";
            ctx.fillRect(-240, 65, 230, 40);
            // Draw instruction text
            ctx.fillStyle = stageRef.current === "DOWN" ? "#4CAF50" : "#FFC107"; // Green for UP, Yellow for DOWN
            ctx.font = "bold 28px Arial"; // Increased font size
            ctx.fillText(instruction, -230, 95);
            // Add white outline to make text pop
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeText(instruction, -230, 95);
            ctx.restore();

            // Draw angle (with its own counter-transform)
            ctx.save();
            ctx.scale(-1, 1);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(
              `${Math.round(angle)}°`,
              -(elbow[0] * canvas.width), // Negative x position to account for mirroring
              elbow[1] * canvas.height
            );
            ctx.restore();
          }
        });

        poseRef.current = pose;
      }

      // Start processing
      const processFrame = async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          await poseRef.current.send({ image: videoRef.current });
          requestAnimationFrame(processFrame);
        }
      };

      processFrame();
      setIsCameraActive(true);
      setError(null);
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
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }
    setIsCameraActive(false);
    setDisplayCounter(0);
    setDisplayStage(null);
    counterRef.current = 0;
    stageRef.current = null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MDTypography variant="h4" color="dark" align="center" mb={3}>
            Posture Sense
          </MDTypography>

          <MDBox sx={{ display: "flex", gap: 2, mb: 3 }}>
            <MDInput
              label="Target Reps"
              type="number"
              value={targetReps}
              onChange={(e) => setTargetReps(Number(e.target.value))}
              sx={{ flex: 1 }}
            />
            <MDInput
              label="Current Weight (kg)"
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              sx={{ flex: 1 }}
            />
          </MDBox>

          <MDBox sx={{ display: "flex", gap: 2, mb: 3 }}>
            <MDButton
              variant="contained"
              color={isCameraActive ? "error" : "info"}
              onClick={isCameraActive ? stopCamera : startCamera}
              sx={{ flex: 1 }}
            >
              {isCameraActive ? "Stop Camera" : "Start Camera"}
            </MDButton>
          </MDBox>

          {error && (
            <MDBox
              sx={{
                backgroundColor: "error.lighter",
                p: 2,
                borderRadius: "0.5rem",
                mb: 3,
              }}
            >
              <MDTypography color="error" align="center">
                {error}
              </MDTypography>
              <MDTypography variant="caption" color="error" align="center" display="block" mt={1}>
                If the problem persists, try refreshing the page or using a different browser.
              </MDTypography>
            </MDBox>
          )}

          <MDBox
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              margin: "0 auto",
              "& video, & canvas": {
                width: "100%",
                transform: "scaleX(-1)", // This inverts the camera horizontally
                WebkitTransform: "scaleX(-1)", // For Safari support
              },
            }}
          >
            <video
              ref={videoRef}
              style={{
                display: "none", // Hide the video element since we're drawing to canvas
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                borderRadius: "1rem",
              }}
            />
          </MDBox>

          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "2rem",
                borderRadius: "1rem",
                textAlign: "center",
                zIndex: 1000,
              }}
            >
              <MDTypography variant="h4" color="white">
                Congratulations! 🎉
              </MDTypography>
              <MDTypography variant="body1" color="white">
                You&apos;ve exceeded your target reps!
              </MDTypography>
            </motion.div>
          )}
        </motion.div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PostureSense;
