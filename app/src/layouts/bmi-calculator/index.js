import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("info");
  const [currentTip, setCurrentTip] = useState(0);

  const healthTips = [
    {
      icon: "restaurant",
      title: "Balanced Diet",
      text: "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
    },
    {
      icon: "directions_run",
      title: "Regular Exercise",
      text: "Aim for at least 150 minutes of moderate exercise per week.",
    },
    {
      icon: "local_drink",
      title: "Stay Hydrated",
      text: "Drink 8-10 glasses of water daily for optimal health.",
    },
    {
      icon: "hotel",
      title: "Adequate Sleep",
      text: "Get 7-9 hours of quality sleep each night for better health.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightInMeters = unit === "metric" ? height / 100 : height * 0.0254;
    let weightInKg = unit === "metric" ? weight : weight * 0.453592;
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));

    // Determine category and color
    if (bmiValue < 18.5) {
      setCategory("Underweight");
      setColor("warning");
    } else if (bmiValue < 25) {
      setCategory("Normal Weight");
      setColor("success");
    } else if (bmiValue < 30) {
      setCategory("Overweight");
      setColor("warning");
    } else {
      setCategory("Obese");
      setColor("error");
    }
  };

  const getRecommendations = () => {
    if (!bmi) return "";
    if (bmi < 18.5) {
      return "Consider increasing your caloric intake and strength training to build muscle mass.";
    } else if (bmi < 25) {
      return "Maintain your healthy lifestyle with balanced diet and regular exercise.";
    } else if (bmi < 30) {
      return "Focus on reducing caloric intake and increasing physical activity.";
    } else {
      return "Consult with a healthcare provider for personalized weight management advice.";
    }
  };

  const getBMIScale = () => {
    const categories = [
      { range: "< 18.5", label: "Underweight", color: "warning.main" },
      { range: "18.5 - 24.9", label: "Normal", color: "success.main" },
      { range: "25 - 29.9", label: "Overweight", color: "warning.main" },
      { range: "> 30", label: "Obese", color: "error.main" },
    ];

    return (
      <MDBox sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={2}>
          {categories.map((cat, index) => (
            <Grid item xs={3} key={index}>
              <Card
                sx={{
                  p: 1,
                  textAlign: "center",
                  backgroundColor: cat.label === category ? cat.color : "transparent",
                  transition: "all 0.3s ease",
                  transform: cat.label === category ? "scale(1.05)" : "scale(1)",
                  boxShadow: cat.label === category ? "0 8px 16px rgba(0,0,0,0.2)" : "none",
                  border: `2px solid ${cat.color}`,
                }}
              >
                <MDTypography
                  variant="caption"
                  fontWeight="bold"
                  color={cat.label === category ? "white" : "dark"}
                >
                  {cat.range}
                </MDTypography>
                <MDTypography
                  variant="button"
                  color={cat.label === category ? "white" : "dark"}
                  sx={{ display: "block" }}
                >
                  {cat.label}
                </MDTypography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    );
  };

  useEffect(() => {
    if (height && weight) {
      calculateBMI();
    }
  }, [height, weight, unit]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #6B8DD6 0%, #8E37D7 100%)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                }}
              >
                <MDTypography variant="h4" color="white" align="center" mb={3}>
                  BMI Calculator
                </MDTypography>

                <MDBox sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <MDButton
                    variant={unit === "metric" ? "contained" : "outlined"}
                    color="white"
                    onClick={() => setUnit("metric")}
                    sx={{ flex: 1 }}
                  >
                    Metric
                  </MDButton>
                  <MDButton
                    variant={unit === "imperial" ? "contained" : "outlined"}
                    color="white"
                    onClick={() => setUnit("imperial")}
                    sx={{ flex: 1 }}
                  >
                    Imperial
                  </MDButton>
                </MDBox>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label={`Height (${unit === "metric" ? "cm" : "inches"})`}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      type="number"
                      fullWidth
                      sx={{ input: { color: "white" }, label: { color: "white" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label={`Weight (${unit === "metric" ? "kg" : "lbs"})`}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      type="number"
                      fullWidth
                      sx={{ input: { color: "white" }, label: { color: "white" } }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {bmi && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      background: `linear-gradient(135deg, ${color}.light 0%, ${color}.main 100%)`,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="h2" color="white" align="center">
                          {bmi}
                        </MDTypography>
                        <MDTypography variant="h4" color="white" align="center">
                          {category}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="body1" color="white" align="center">
                          {getRecommendations()}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid>
            )}

            <Grid item xs={12}>
              {getBMIScale()}
            </Grid>

            <Grid item xs={12}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <Icon sx={{ fontSize: 40, color: "white" }}>
                          {healthTips[currentTip].icon}
                        </Icon>
                      </Grid>
                      <Grid item xs={10}>
                        <MDTypography variant="h6" color="white">
                          {healthTips[currentTip].title}
                        </MDTypography>
                        <MDTypography variant="body2" color="white">
                          {healthTips[currentTip].text}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </Grid>
          </Grid>
        </motion.div>
      </MDBox>
    </DashboardLayout>
  );
};

export default BMICalculator;
