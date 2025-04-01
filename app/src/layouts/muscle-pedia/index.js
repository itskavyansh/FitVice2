/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useRef } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Custom components
import { CardContainer, CardBody, CardItem } from "components/ui/3d-card";

const muscles = [
  {
    name: "Biceps Brachii",
    description: "Located in the upper arm, responsible for forearm supination and elbow flexion.",
    exercises: ["Bicep Curls", "Hammer Curls", "Chin-ups"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2560&auto=format&fit=crop",
  },
  {
    name: "Quadriceps",
    description: "Group of four muscles in the front of the thigh, responsible for knee extension.",
    exercises: ["Squats", "Lunges", "Leg Press"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2560&auto=format&fit=crop",
  },
  {
    name: "Deltoids",
    description: "Shoulder muscles responsible for arm abduction and rotation.",
    exercises: ["Shoulder Press", "Lateral Raises", "Front Raises"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2560&auto=format&fit=crop",
  },
];

function MuscleCard({ muscle }) {
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
    const rotateY = (x - centerX) / 20;
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
        sx={{
          transform: `rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,
          position: "relative",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            "& .card-content": {
              transform: "scale(1.05)",
              transition: "all 0.5s ease",
              transformOrigin: "center center",
            },
          },
          "& .card-content": {
            transition: "all 0.5s ease",
            transformOrigin: "center center",
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
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
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
              maxWidth: "sm",
              mt: 1,
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {muscle.description}
          </Typography>
        </CardItem>
        <CardItem translateZ={100} sx={{ width: "100%", mt: 2 }}>
          <img
            className="card-content"
            src={muscle.image}
            alt={muscle.name}
            style={{
              height: "240px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </CardItem>
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 5,
          }}
        >
          <CardItem translateZ={20}>
            <Button
              className="card-content"
              variant="text"
              color="primary"
              sx={{
                px: 2,
                py: 1,
                borderRadius: "12px",
                fontSize: "0.75rem",
              }}
            >
              View Exercises →
            </Button>
          </CardItem>
          <CardItem translateZ={20}>
            <Button
              className="card-content"
              variant="contained"
              color="primary"
              sx={{
                px: 2,
                py: 1,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              Learn More
            </Button>
          </CardItem>
        </MDBox>
      </CardBody>
    </CardContainer>
  );
}

function MusclePedia() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Typography variant="h4" fontWeight="bold">
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