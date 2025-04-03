import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  AppBar,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";

// Features data
const features = [
  {
    icon: "fitness_center",
    title: "Personalized Workout Plans",
    description: "Get customized workout routines tailored to your goals and fitness level.",
  },
  {
    icon: "self_improvement",
    title: "Yoga Classes",
    description: "Access guided yoga sessions for flexibility and mental wellness.",
  },
  {
    icon: "restaurant_menu",
    title: "Nutrition Guide",
    description: "Receive personalized nutrition advice and meal planning assistance.",
  },
  {
    icon: "monitor_weight",
    title: "BMI Calculator",
    description: "Track your body mass index and get personalized recommendations.",
  },
  {
    icon: "accessibility_new",
    title: "PostureSense",
    description: "AI-powered posture analysis and correction guidance.",
  },
  {
    icon: "checklist",
    title: "ToDo List",
    description: "Stay organized with your fitness goals and daily tasks.",
  },
  {
    icon: "science",
    title: "MusclePedia",
    description: "Comprehensive guide to muscle anatomy and exercises.",
  },
  {
    icon: "smart_toy",
    title: "AI Assistant",
    description: "Get instant answers to your fitness and health questions.",
  },
  {
    icon: "health_and_safety",
    title: "Health Tips",
    description: "Daily tips and advice for maintaining a healthy lifestyle.",
  },
];

function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleGetStarted = () => {
    navigate("/auth/login");
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToAdvantages = () => {
    const advantagesSection = document.getElementById("advantages-section");
    advantagesSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        overflow: "hidden",
        position: "relative",
        bgcolor: "#121212",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.3)",
          opacity: 0.4,
          zIndex: 0,
        },
      }}
    >
      {/* Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: "rgba(18, 18, 18, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography 
            variant="h2" 
            onClick={() => window.location.reload()}
            sx={{ 
              fontWeight: 950,
              fontSize: "2.8rem",
              letterSpacing: "2px",
              textShadow: "0 0 10px rgba(255,255,255,0.1)",
              cursor: "pointer",
              color: "#fff",
              "&:hover": { 
                opacity: 0.8,
                transition: "opacity 0.2s ease-in-out"
              }
            }}
          >
            FITVICE
          </Typography>
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Typography 
              onClick={scrollToTop}
              sx={{ 
                cursor: "pointer", 
                "&:hover": { color: "#fff" },
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              HOME
            </Typography>
            <Typography 
              onClick={scrollToAbout}
              sx={{ 
                cursor: "pointer", 
                "&:hover": { color: "#fff" },
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              ABOUT US
            </Typography>
            <Typography 
              onClick={scrollToAdvantages}
              sx={{ 
                cursor: "pointer", 
                "&:hover": { color: "#fff" },
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              ADVANTAGES
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="text"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  px: 2,
                  py: 1,
                  minHeight: "40px",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  },
                }}
              >
                SIGN IN
              </Button>
              <Typography 
                sx={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                }}
              >
                or
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  px: 2,
                  py: 1,
                  minHeight: "40px",
                  "&:hover": {
                    borderColor: "#1976d2",
                    bgcolor: "#1976d2",
                    color: "#fff !important",
                    "& .MuiButton-label": {
                      color: "#fff",
                    },
                  },
                }}
              >
                SIGN UP
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          pl: 0,
          pr: 0,
          pt: { xs: 8, md: 8 },
        }}
      >
        {/* Content */}
        <Box 
          sx={{ 
            position: "relative", 
            zIndex: 1, 
            pl: 0,
            pr: 0,
            mx: 0,
            width: "100%",
            mt: 0,
          }}
        >
          <Grid container spacing={0} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ marginLeft: 0, paddingLeft: "24px", marginTop: "64px" }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    lineHeight: 1.1,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "-1px",
                    textAlign: "left",
                    maxWidth: "100%",
                    pl: 0,
                    ml: 0,
                    color: "#fff",
                    textShadow: "0 0 20px rgba(255,255,255,0.1)",
                  }}
                >
                  SMART WORKOUT PLANS TAILORED TO YOUR NEEDS
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontFamily: "'Montserrat', sans-serif",
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    pl: 0,
                    ml: 0,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <Box component="span" sx={{ fontWeight: 700, color: "#fff" }}>
                    FITVICE
                  </Box>{" "}
                  is your fitness and wellness tracker. From gym workouts and yoga to meditation and mental health, it keeps you on top of your goals. Track steps, sleep, and workouts, compete on leaderboards, and take on challenges.
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    height: "50px",
                    width: "250px",
                    position: "relative",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    border: "2px solid #1976d2",
                    overflow: "hidden",
                    borderRadius: "30px",
                    color: "#1976d2",
                    transition: "all 0.5s ease-in-out",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "4px",
                    "&:hover": {
                      boxShadow: "0 0 20px rgba(25, 118, 210, 0.3)",
                      color: "#fff",
                      border: "none",
                      bgcolor: "#1976d2",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      transition: "all 0.5s ease-in-out",
                      bgcolor: "#1976d2",
                      borderRadius: "30px",
                      visibility: "hidden",
                      height: "10px",
                      width: "10px",
                      zIndex: -1,
                    },
                    "&:hover::after": {
                      visibility: "visible",
                      transform: "scale(100) translateX(2px)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  position: "absolute",
                  top: "64px",
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingRight: "24px",
                }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 950,
                    fontSize: "2.4rem",
                    letterSpacing: "2px",
                    textShadow: "0 0 10px rgba(255,255,255,0.1)",
                    mb: 1,
                    textAlign: "center",
                    width: "220px",
                    color: "#fff",
                  }}
                >
                  FITVICE
                </Typography>
                <Box
                  sx={{
                    border: "3px solid rgba(255,255,255,0.1)",
                    p: 3,
                    borderRadius: "30px",
                    width: 220,
                    height: 380,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    gap: 3,
                    position: "relative",
                    pt: 8,
                    bgcolor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 100,
                      height: 20,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 40,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "0.5px",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      color: "#fff",
                    }}
                  >
                    KEEP TRACK.
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "0.5px",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      color: "#fff",
                    }}
                  >
                    STAY STRONG.
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "0.5px",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      color: "#fff",
                    }}
                  >
                    THRIVE DAILY.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        id="advantages-section"
        sx={{
          py: 4,
          mt: 2,
          scrollMarginTop: "100px",
          bgcolor: "rgba(18, 18, 18, 0.8)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "1px",
              color: "#fff",
            }}
          >
            Why Choose FitVice?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MDBox
                    p={4}
                    sx={{
                      height: "100%",
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: 3,
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        bgcolor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 48,
                        mb: 3,
                        opacity: 0.9,
                        color: "#1976d2",
                      }}
                    >
                      {feature.icon}
                    </Icon>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600, 
                        fontFamily: "'Playfair Display', serif",
                        color: "#fff",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontFamily: "'Montserrat', sans-serif",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </MDBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box
        id="about-section"
        sx={{
          py: 8,
          bgcolor: "rgba(18, 18, 18, 0.9)",
          mt: 4,
          scrollMarginTop: "100px",
          width: "100%",
          maxWidth: "100%",
          mx: 0,
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg" sx={{ mx: "auto" }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ paddingTop: "50px" }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    mb: 4,
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "1px",
                    color: "#fff",
                  }}
                >
                  About FitVice
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontFamily: "'Montserrat', sans-serif",
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  FitVice is more than just a fitness app - it&apos;s your personal wellness companion. We believe in making fitness accessible, enjoyable, and sustainable for everyone.
                </Typography>
                <Typography
                  sx={{
                    mb: 4,
                    fontFamily: "'Montserrat', sans-serif",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Our platform combines cutting-edge technology with expert knowledge to provide you
                  with personalized workout plans, nutrition guidance, and wellness tracking tools.
                  Whether you&apos;re just starting your fitness journey or you&apos;re a seasoned athlete,
                  FitVice is here to support your goals.
                </Typography>
                <Button
                  variant="text"
                  size="large"
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    cursor: "pointer",
                    outline: "none",
                    border: "none",
                    verticalAlign: "middle",
                    textDecoration: "none",
                    background: "transparent",
                    padding: 0,
                    width: "12rem",
                    height: "auto",
                    fontFamily: "'Montserrat', sans-serif",
                    "& .circle": {
                      transition: "all 0.45s cubic-bezier(0.65, 0, 0.076, 1)",
                      position: "relative",
                      display: "block",
                      margin: 0,
                      width: "3rem",
                      height: "3rem",
                      background: "#1976d2",
                      borderRadius: "1.625rem",
                    },
                    "& .circle .icon": {
                      transition: "all 0.45s cubic-bezier(0.65, 0, 0.076, 1)",
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      margin: "auto",
                      background: "#fff",
                    },
                    "& .circle .icon.arrow": {
                      transition: "all 0.45s cubic-bezier(0.65, 0, 0.076, 1)",
                      left: "0.625rem",
                      width: "1.125rem",
                      height: "0.125rem",
                      background: "none",
                    },
                    "& .circle .icon.arrow::before": {
                      position: "absolute",
                      content: '""',
                      top: "-0.29rem",
                      right: "0.0625rem",
                      width: "0.625rem",
                      height: "0.625rem",
                      borderTop: "0.125rem solid #fff",
                      borderRight: "0.125rem solid #fff",
                      transform: "rotate(45deg)",
                    },
                    "& .button-text": {
                      transition: "all 0.45s cubic-bezier(0.65, 0, 0.076, 1)",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "0.75rem 0",
                      margin: "0 0 0 1.85rem",
                      color: "#1976d2",
                      fontWeight: 700,
                      lineHeight: 1.6,
                      textAlign: "center",
                      textTransform: "uppercase",
                    },
                    "&:hover .circle": {
                      width: "100%",
                    },
                    "&:hover .circle .icon.arrow": {
                      background: "#fff",
                      transform: "translate(1rem, 0)",
                    },
                    "&:hover .button-text": {
                      color: "#fff",
                    },
                  }}
                >
                  <span className="circle">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Learn More</span>
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    Our Mission
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Help Center Section */}
      <Box sx={{ py: 12, bgcolor: "rgba(18, 18, 18, 0.8)" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ 
              mb: 8, 
              fontWeight: 800, 
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "1px",
              color: "#fff",
            }}
          >
            Need Help?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MDBox
                  p={4}
                  sx={{
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    textAlign: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 48, mb: 3, opacity: 0.9, color: "#1976d2" }}>help</Icon>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600, 
                      fontFamily: "'Playfair Display', serif",
                      color: "#fff",
                    }}
                  >
                    FAQ
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontFamily: "'Montserrat', sans-serif",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Find answers to commonly asked questions about FitVice features and services.
                  </Typography>
                </MDBox>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <MDBox
                  p={4}
                  sx={{
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    textAlign: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 48, mb: 3, opacity: 0.9, color: "#1976d2" }}>support_agent</Icon>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600, 
                      fontFamily: "'Playfair Display', serif",
                      color: "#fff",
                    }}
                  >
                    Contact Support
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontFamily: "'Montserrat', sans-serif",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Get in touch with our support team for personalized assistance.
                  </Typography>
                </MDBox>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MDBox
                  p={4}
                  sx={{
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    textAlign: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 48, mb: 3, opacity: 0.9, color: "#1976d2" }}>forum</Icon>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600, 
                      fontFamily: "'Playfair Display', serif",
                      color: "#fff",
                    }}
                  >
                    Community
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontFamily: "'Montserrat', sans-serif",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Join our community forum to connect with other users and share experiences.
                  </Typography>
                </MDBox>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing; 