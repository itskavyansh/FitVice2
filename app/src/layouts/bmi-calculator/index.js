import { useState, useEffect, useRef } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import { motion } from 'framer-motion';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Icon from '@mui/material/Icon';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Confetti from 'react-confetti';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('info');
  const [currentTip, setCurrentTip] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [idealWeight, setIdealWeight] = useState({ min: 0, max: 0 });
  const [history, setHistory] = useState([]);
  const containerRef = useRef(null);

  const healthTips = [
    {
      icon: 'restaurant',
      title: 'Balanced Diet',
      text: 'Maintain a balanced diet rich in fruits, vegetables, and whole grains for optimal health.',
    },
    {
      icon: 'directions_run',
      title: 'Regular Exercise',
      text: 'Aim for at least 150 minutes of moderate exercise per week to maintain fitness.',
    },
    {
      icon: 'local_drink',
      title: 'Stay Hydrated',
      text: 'Drink 8-10 glasses of water daily for optimal health and improved metabolism.',
    },
    {
      icon: 'hotel',
      title: 'Adequate Sleep',
      text: 'Get 7-9 hours of quality sleep each night for better health and weight management.',
    },
  ];

  const bmiCategories = [
    { range: [0, 16], label: 'Severe Thinness', color: '#d32f2f' },
    { range: [16, 17], label: 'Moderate Thinness', color: '#f57c00' },
    { range: [17, 18.5], label: 'Mild Thinness', color: '#ffa000' },
    { range: [18.5, 25], label: 'Normal', color: '#4caf50' },
    { range: [25, 30], label: 'Overweight', color: '#f57c00' },
    { range: [30, 35], label: 'Obese Class I', color: '#e64a19' },
    { range: [35, 40], label: 'Obese Class II', color: '#d32f2f' },
    { range: [40, 100], label: 'Obese Class III', color: '#b71c1c' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum)) return;
    if (heightNum <= 0 || weightNum <= 0) return;

    let heightInMeters = unit === 'metric' ? heightNum / 100 : heightNum * 0.0254;
    let weightInKg = unit === 'metric' ? weightNum : weightNum * 0.453592;
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    if (isNaN(bmiValue) || !isFinite(bmiValue)) return;

    setBmi(bmiValue.toFixed(1));

    const minIdealBMI = 18.5;
    const maxIdealBMI = 24.9;
    const minIdealWeight = minIdealBMI * heightInMeters * heightInMeters;
    const maxIdealWeight = maxIdealBMI * heightInMeters * heightInMeters;

    setIdealWeight({
      min: unit === 'metric' ? minIdealWeight.toFixed(1) : (minIdealWeight * 2.20462).toFixed(1),
      max: unit === 'metric' ? maxIdealWeight.toFixed(1) : (maxIdealWeight * 2.20462).toFixed(1),
    });

    let newCategory = '';
    let newColor = '';

    for (const cat of bmiCategories) {
      if (bmiValue >= cat.range[0] && bmiValue < cat.range[1]) {
        newCategory = cat.label;
        newColor = cat.color;
        break;
      }
    }

    setCategory(newCategory);
    setColor(newColor);

    const newEntry = {
      date: new Date().toLocaleDateString(),
      bmi: bmiValue.toFixed(1),
      weight: weightInKg.toFixed(1),
      category: newCategory,
    };

    if (history.length === 0 || history[history.length - 1].bmi !== newEntry.bmi) {
      setHistory([...history, newEntry]);
    }

    if (bmiValue >= 18.5 && bmiValue < 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getRecommendations = () => {
    if (!bmi) return '';
    if (bmi < 18.5) {
      return 'Consider increasing your caloric intake with nutrient-rich foods and adding strength training to build muscle mass.';
    } else if (bmi < 25) {
      return "You're in a healthy weight range! Maintain your balanced diet and regular exercise routine.";
    } else if (bmi < 30) {
      return 'Focus on gradually reducing caloric intake and increasing physical activity. Aim for 30 minutes of exercise daily.';
    } else {
      return "It's advisable to consult with a healthcare provider for personalized weight management guidance.";
    }
  };

  const getBMIScaleValue = () => {
    if (!bmi) return 10;
    const bmiNum = parseFloat(bmi);
    return isNaN(bmiNum) ? 10 : Math.min(Math.max(bmiNum, 10), 40);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {showConfetti && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      <MDBox sx={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }} ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <Tab label="Calculator" sx={{ fontWeight: 'bold' }} />
                <Tab label="History" sx={{ fontWeight: 'bold' }} />
                <Tab label="Information" sx={{ fontWeight: 'bold' }} />
              </Tabs>
            </Grid>

            {tabValue === 0 && (
              <Grid item xs={12} container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, #42424a 0%, #191919 100%)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      borderRadius: '15px',
                    }}
                  >
                    <MDTypography
                      variant="h4"
                      color="white"
                      align="center"
                      mb={3}
                      fontWeight="bold"
                    >
                      BMI Calculator
                    </MDTypography>

                    <MDBox sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <MDButton
                        variant={unit === 'metric' ? 'contained' : 'outlined'}
                        color="info"
                        onClick={() => setUnit('metric')}
                        sx={{ flex: 1, p: 1.5 }}
                      >
                        <Icon sx={{ mr: 1 }}>straighten</Icon> Metric
                      </MDButton>
                      <MDButton
                        variant={unit === 'imperial' ? 'contained' : 'outlined'}
                        color="info"
                        onClick={() => setUnit('imperial')}
                        sx={{ flex: 1, p: 1.5 }}
                      >
                        <Icon sx={{ mr: 1 }}>square_foot</Icon> Imperial
                      </MDButton>
                    </MDBox>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDBox>
                          <MDTypography variant="subtitle2" color="white" gutterBottom>
                            Height ({unit === 'metric' ? 'cm' : 'inches'})
                          </MDTypography>
                          <MDInput
                            value={height}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setHeight(value);
                              }
                            }}
                            type="text"
                            fullWidth
                            inputProps={{ inputMode: 'decimal' }}
                            sx={{
                              input: { color: '#333' },
                              '& .MuiInputBase-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDBox>
                          <MDTypography variant="subtitle2" color="white" gutterBottom>
                            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                          </MDTypography>
                          <MDInput
                            value={weight}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setWeight(value);
                              }
                            }}
                            type="text"
                            fullWidth
                            inputProps={{ inputMode: 'decimal' }}
                            sx={{
                              input: { color: '#333' },
                              '& .MuiInputBase-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </MDBox>
                      </Grid>
                    </Grid>

                    <MDBox sx={{ mt: 3, textAlign: 'center' }}>
                      <MDButton
                        variant="contained"
                        color="info"
                        size="large"
                        onClick={calculateBMI}
                        sx={{
                          px: 5,
                          py: 1.5,
                          borderRadius: '10px',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        }}
                      >
                        <Icon sx={{ mr: 1 }}>calculate</Icon>
                        Calculate BMI
                      </MDButton>
                    </MDBox>
                  </Card>
                </Grid>

                {bmi && (
                  <>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          p: 3,
                          background: `linear-gradient(135deg, ${color}20 0%, ${color} 100%)`,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                          borderRadius: '15px',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <MDBox
                              sx={{
                                textAlign: 'center',
                                p: 2,
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <MDTypography variant="h2" color="white" align="center">
                                {bmi}
                              </MDTypography>
                              <MDTypography variant="h4" color="white" align="center">
                                {category}
                              </MDTypography>
                            </MDBox>
                            <MDBox sx={{ mt: 2, textAlign: 'center' }}>
                              <MDTypography variant="caption" color="white">
                                Ideal Weight Range:
                              </MDTypography>
                              <MDTypography variant="button" color="white" display="block">
                                {idealWeight.min} - {idealWeight.max}{' '}
                                {unit === 'metric' ? 'kg' : 'lbs'}
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <MDTypography variant="body1" color="white" sx={{ mb: 2 }}>
                              {getRecommendations()}
                            </MDTypography>
                            <Box sx={{ px: 2 }}>
                              <Slider
                                value={getBMIScaleValue()}
                                min={10}
                                max={40}
                                step={0.1}
                                disabled
                                sx={{
                                  '& .MuiSlider-thumb': {
                                    height: 24,
                                    width: 24,
                                    backgroundColor: '#fff',
                                  },
                                  '& .MuiSlider-track': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                  },
                                  '& .MuiSlider-rail': {
                                    opacity: 0.5,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  },
                                }}
                              />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'white', fontSize: '0.75rem' }}>
                                  Underweight
                                </span>
                                <span style={{ color: 'white', fontSize: '0.75rem' }}>Normal</span>
                                <span style={{ color: 'white', fontSize: '0.75rem' }}>
                                  Overweight
                                </span>
                                <span style={{ color: 'white', fontSize: '0.75rem' }}>Obese</span>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                          borderRadius: '15px',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={2}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                margin: '0 auto',
                              }}
                            >
                              <Icon sx={{ fontSize: 40, color: 'white' }}>
                                {healthTips[currentTip].icon}
                              </Icon>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={10}>
                            <MDTypography variant="h6" color="white" fontWeight="bold">
                              {healthTips[currentTip].title}
                            </MDTypography>
                            <MDTypography variant="body2" color="white">
                              {healthTips[currentTip].text}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </>
                )}
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #42424a 0%, #191919 100%)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    borderRadius: '15px',
                  }}
                >
                  <MDTypography variant="h4" color="white" align="center" mb={3} fontWeight="bold">
                    BMI History
                  </MDTypography>

                  {history.length === 0 ? (
                    <MDBox sx={{ p: 3, textAlign: 'center' }}>
                      <Icon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.5)' }}>history</Icon>
                      <MDTypography variant="h6" color="white" mt={2}>
                        No history available yet
                      </MDTypography>
                      <MDTypography variant="body2" color="white" opacity={0.7}>
                        Calculate your BMI to start tracking your progress
                      </MDTypography>
                    </MDBox>
                  ) : (
                    <MDBox>
                      {history.map((entry, index) => (
                        <Card
                          key={index}
                          sx={{
                            p: 2,
                            mb: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                          }}
                        >
                          <Grid container alignItems="center">
                            <Grid item xs={3}>
                              <MDTypography variant="caption" color="white" opacity={0.7}>
                                Date
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                {entry.date}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDTypography variant="caption" color="white" opacity={0.7}>
                                Weight
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                {entry.weight} {unit === 'metric' ? 'kg' : 'lbs'}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDTypography variant="caption" color="white" opacity={0.7}>
                                BMI
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                {entry.bmi}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDTypography variant="caption" color="white" opacity={0.7}>
                                Category
                              </MDTypography>
                              <MDTypography variant="body2" color="white">
                                {entry.category}
                              </MDTypography>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </MDBox>
                  )}
                </Card>
              </Grid>
            )}

            {tabValue === 2 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #42424a 0%, #191919 100%)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    borderRadius: '15px',
                  }}
                >
                  <MDTypography variant="h4" color="white" align="center" mb={3} fontWeight="bold">
                    BMI Information
                  </MDTypography>

                  <MDBox sx={{ mb: 4 }}>
                    <MDTypography variant="h6" color="white" mb={1}>
                      What is BMI?
                    </MDTypography>
                    <MDTypography variant="body2" color="white" opacity={0.7}>
                      Body Mass Index (BMI) is a value derived from the weight and height of a
                      person. It is defined as the body mass divided by the square of the body
                      height, and is universally expressed in units of kg/m², resulting from mass in
                      kilograms and height in meters.
                    </MDTypography>
                  </MDBox>

                  <MDBox sx={{ mb: 4 }}>
                    <MDTypography variant="h6" color="white" mb={1}>
                      BMI Categories
                    </MDTypography>
                    <MDBox sx={{ pl: 2 }}>
                      {bmiCategories.map((cat, index) => (
                        <MDBox key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              bgcolor: cat.color,
                              borderRadius: '50%',
                              mr: 2,
                            }}
                          />
                          <MDTypography variant="body2" color="white">
                            <strong>
                              {cat.range[0]}-{cat.range[1]}
                            </strong>
                            : {cat.label}
                          </MDTypography>
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>

                  <MDBox>
                    <MDTypography variant="h6" color="white" mb={1}>
                      Limitations
                    </MDTypography>
                    <MDTypography variant="body2" color="white" opacity={0.7}>
                      While BMI is a useful measure for most people, it has some limitations:
                    </MDTypography>
                    <MDBox component="ul" sx={{ pl: 4, mt: 1 }}>
                      <MDTypography component="li" variant="body2" color="white" opacity={0.7}>
                        It may overestimate body fat in athletes and others with muscular builds.
                      </MDTypography>
                      <MDTypography component="li" variant="body2" color="white" opacity={0.7}>
                        It may underestimate body fat in older persons and those who have lost
                        muscle mass.
                      </MDTypography>
                      <MDTypography component="li" variant="body2" color="white" opacity={0.7}>
                        BMI is not a direct measure of body fat and doesn&apos;t account for fat
                        distribution.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </MDBox>
    </DashboardLayout>
  );
};

export default BMICalculator;
