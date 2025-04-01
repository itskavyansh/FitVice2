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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function PostureSense() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const counterRef = useRef(0);
  const [displayCounter, setDisplayCounter] = useState(0);
  const [displayStage, setDisplayStage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    let video = null;
    let pose = null;
    let animationFrame = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video = videoRef.current;
        video.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        });

        // Initialize MediaPipe Pose
        const mp = await import("@mediapipe/pose");
        const mp_drawing = await import("@mediapipe/drawing_utils");
        pose = new mp.Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
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
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Get coordinates
            const shoulder = [
              landmarks[11].x, // LEFT_SHOULDER
              landmarks[11].y,
            ];
            const elbow = [
              landmarks[13].x, // LEFT_ELBOW
              landmarks[13].y,
            ];
            const wrist = [
              landmarks[15].x, // LEFT_WRIST
              landmarks[15].y,
            ];

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
            }

            // Draw landmarks
            mp_drawing.drawConnectors(ctx, results.poseLandmarks, mp.POSE_CONNECTIONS, {
              color: "#F57542",
              lineWidth: 2,
              radius: 2,
            });
            mp_drawing.drawLandmarks(ctx, results.poseLandmarks, {
              color: "#F542E6",
              lineWidth: 2,
              radius: 2,
            });
            // Draw angle
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(
              `${Math.round(angle)}°`,
              elbow[0] * canvas.width,
              elbow[1] * canvas.height
            );

            // Draw counter and stage
            ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
            ctx.fillRect(0, 0, 200, 70);
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("REPS", 20, 20);
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.fillText(counterRef.current.toString(), 25, 60);
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("STAGE", 100, 20);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(stageRef.current || "", 100, 60);
          }
        });

        // Start processing
        const processFrame = async () => {
          if (video && pose && video.readyState === video.HAVE_ENOUGH_DATA) {
            await pose.send({ image: video });
            animationFrame = requestAnimationFrame(processFrame);
          }
        };

        processFrame();
        setIsCameraActive(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (pose) {
        pose.close();
      }
      setIsCameraActive(false);
    };
  }, []); // Remove stage and counter from dependencies

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Typography variant="h4" fontWeight="bold">
                PostureSense
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time pose detection and exercise tracking
              </Typography>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                padding: "24px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <video
                ref={videoRef}
                style={{
                  display: "none",
                }}
                autoPlay
                playsInline
              />
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  display: isCameraActive ? "block" : "none",
                }}
              />
              {!isCameraActive && (
                <Typography variant="body1" color="text.secondary" align="center">
                  Loading camera...
                </Typography>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PostureSense;
