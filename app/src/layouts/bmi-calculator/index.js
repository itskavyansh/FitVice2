import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("info");

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
          maxWidth: "600px",
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
            BMI Calculator
          </MDTypography>

          <MDBox sx={{ display: "flex", gap: 2, mb: 3 }}>
            <MDButton
              variant={unit === "metric" ? "contained" : "outlined"}
              color="info"
              onClick={() => setUnit("metric")}
              sx={{ flex: 1 }}
            >
              Metric
            </MDButton>
            <MDButton
              variant={unit === "imperial" ? "contained" : "outlined"}
              color="info"
              onClick={() => setUnit("imperial")}
              sx={{ flex: 1 }}
            >
              Imperial
            </MDButton>
          </MDBox>

          <MDBox sx={{ display: "flex", gap: 2, mb: 3 }}>
            <MDInput
              label={`Height (${unit === "metric" ? "cm" : "inches"})`}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              fullWidth
            />
            <MDInput
              label={`Weight (${unit === "metric" ? "kg" : "lbs"})`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
              fullWidth
            />
          </MDBox>

          {bmi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MDBox
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: "0.5rem",
                  backgroundColor: `${color}.lighter`,
                  mb: 2,
                }}
              >
                <MDTypography variant="h3" color={color} mb={1}>
                  {bmi}
                </MDTypography>
                <MDTypography variant="h5" color={color}>
                  {category}
                </MDTypography>
              </MDBox>

              <MDTypography variant="body1" color="text" align="center">
                {getRecommendations()}
              </MDTypography>
            </motion.div>
          )}
        </motion.div>
      </MDBox>
    </DashboardLayout>
  );
};

export default BMICalculator;
