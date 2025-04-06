import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  useTheme,
  Fade,
  Slide,
  Grow,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import geminiService from '../../services/geminiService';

// Icon mapping
const iconMap = {
  Restaurant: RestaurantIcon,
  LocalDining: LocalDiningIcon,
  FoodBank: FoodBankIcon,
  HealthAndSafety: HealthAndSafetyIcon,
  FitnessCenter: FitnessCenterIcon,
  WaterDrop: WaterDropIcon,
  Favorite: FavoriteIcon,
  Lightbulb: LightbulbIcon,
  EmojiFoodBeverage: EmojiFoodBeverageIcon,
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const RecipeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  padding: theme.spacing(2),
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(1, 0),
  marginBottom: theme.spacing(2),
  zIndex: 1,
  height: '150px',
}));

const CarouselTrack = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
  width: '100%',
  position: 'relative',
  height: '100%',
});

const getCardGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', // Coral
    'linear-gradient(135deg, #4ECDC4 0%, #45B7AF 100%)', // Turquoise
    'linear-gradient(135deg, #FFD166 0%, #FFB347 100%)', // Gold
    'linear-gradient(135deg, #06D6A0 0%, #05B888 100%)', // Mint
    'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)', // Purple
    'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)', // Pink
    'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', // Blue
    'linear-gradient(135deg, #34D399 0%, #10B981 100%)', // Emerald
  ];
  return gradients[index % gradients.length];
};

const TipCard = styled(Card)(({ theme, index }) => ({
  width: '100%',
  minHeight: '140px',
  borderRadius: '15px',
  background: getCardGradient(index),
  color: theme.palette.common.white,
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(1.5),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '& .MuiTypography-root': {
    color: theme.palette.common.white,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  marginRight: theme.spacing(1.5),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
}));

const DescriptionWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(6),
  marginTop: theme.spacing(-1),
}));

const NutritionGuide = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [healthQuestion, setHealthQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [nutritionTips, setNutritionTips] = useState([
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain optimal body function.",
      icon: "WaterDrop"
    },
    {
      title: "Balanced Diet",
      description: "Include a variety of fruits, vegetables, proteins, and whole grains in your meals.",
      icon: "Restaurant"
    },
    {
      title: "Portion Control",
      description: "Be mindful of portion sizes to maintain a healthy weight and energy levels.",
      icon: "LocalDining"
    },
    {
      title: "Regular Exercise",
      description: "Combine good nutrition with regular physical activity for best results.",
      icon: "FitnessCenter"
    }
  ]);
  
  // Add recipe tips state
  const [recipeTips, setRecipeTips] = useState([
    {
      title: "Mise en Place",
      description: "Prepare and organize all ingredients before starting to cook for better efficiency.",
      icon: "Restaurant"
    },
    {
      title: "Temperature Control",
      description: "Learn to control heat levels - high heat isn't always best for cooking.",
      icon: "LocalDining"
    },
    {
      title: "Fresh Ingredients",
      description: "Use fresh, quality ingredients for the best flavor in your dishes.",
      icon: "FoodBank"
    },
    {
      title: "Seasoning Balance",
      description: "Season throughout cooking, not just at the end, for better flavor development.",
      icon: "EmojiFoodBeverage"
    }
  ]);
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentRecipeTipIndex, setCurrentRecipeTipIndex] = useState(0);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState('left');
  const [recipeSlideDirection, setRecipeSlideDirection] = useState('left');
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [recipeCarouselItems, setRecipeCarouselItems] = useState([]);

  useEffect(() => {
    if (nutritionTips.length > 0) {
      const duplicatedTips = [...nutritionTips, ...nutritionTips, ...nutritionTips];
      setCarouselItems(duplicatedTips);
    }
  }, [nutritionTips]);

  useEffect(() => {
    if (carouselItems.length > 0) {
      const interval = setInterval(() => {
        setSlideDirection('left');
        setCurrentTipIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // When reaching the end of the duplicated array, smoothly transition back to the middle
          if (nextIndex >= nutritionTips.length * 2) {
            return nutritionTips.length;
          }
          return nextIndex;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [carouselItems.length, nutritionTips.length]);

  useEffect(() => {
    if (recipeTips.length > 0) {
      const duplicatedTips = [...recipeTips, ...recipeTips, ...recipeTips];
      setRecipeCarouselItems(duplicatedTips);
    }
  }, [recipeTips]);

  useEffect(() => {
    if (recipeCarouselItems.length > 0) {
      const interval = setInterval(() => {
        setRecipeSlideDirection('left');
        setCurrentRecipeTipIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= recipeTips.length * 2) {
            return recipeTips.length;
          }
          return nextIndex;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [recipeCarouselItems.length, recipeTips.length]);

  const loadNutritionTips = async () => {
    try {
      const response = await geminiService.getNutritionTips();
      if (response.success) {
        setNutritionTips(response.data);
      }
    } catch (err) {
      console.error('Error loading nutrition tips:', err);
    } finally {
      setTipsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue); // Debug log
    setActiveTab(newValue);
  };

  const handleGenerateRecipe = async () => {
    console.log('Generating recipe for ingredients:', ingredients);
    if (!ingredients.trim()) {
      setError('Please enter some ingredients');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await geminiService.generateRecipe(ingredients);
      console.log('Recipe response:', response);
      if (response.success) {
        setRecipe(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAskHealthQuestion = async () => {
    console.log('Asking health question:', healthQuestion);
    if (!healthQuestion.trim()) {
      setAiError('Please enter your health question');
      return;
    }

    setAiLoading(true);
    setAiError('');
    try {
      const response = await geminiService.askHealthQuestion(healthQuestion);
      console.log('AI response:', response);
      if (response.success) {
        setAiResponse(response.data);
      } else {
        setAiError(response.message);
      }
    } catch (err) {
      console.error('AI question error:', err);
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleNextTip = () => {
    setSlideDirection('left');
    setCurrentTipIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= nutritionTips.length * 2) {
        return nutritionTips.length;
      }
      return nextIndex;
    });
  };

  const handlePrevTip = () => {
    setSlideDirection('right');
    setCurrentTipIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      if (nextIndex < nutritionTips.length) {
        return nutritionTips.length * 2 - 1;
      }
      return nextIndex;
    });
  };

  const handleNextRecipeTip = () => {
    setRecipeSlideDirection('left');
    setCurrentRecipeTipIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= recipeTips.length * 2) {
        return recipeTips.length;
      }
      return nextIndex;
    });
  };

  const handlePrevRecipeTip = () => {
    setRecipeSlideDirection('right');
    setCurrentRecipeTipIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      if (nextIndex < recipeTips.length) {
        return recipeTips.length * 2 - 1;
      }
      return nextIndex;
    });
  };

  const renderRecipeGenerator = () => (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        AI Recipe Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter your ingredients and let our AI create a healthy recipe for you!
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Enter your ingredients (e.g., chicken, spinach, tomatoes)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateRecipe}
          disabled={loading}
          sx={{ minWidth: '120px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Recipe'}
        </Button>
      </Box>

      {/* Recipe Tips Carousel */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
          Cooking Tips
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          height: '150px',
        }}>
          <CarouselTrack sx={{ 
            transform: `translateX(-${currentRecipeTipIndex * 100}%)`,
            display: 'flex',
            width: '100%',
            height: '100%',
          }}>
            {recipeCarouselItems.map((tip, index) => {
              const IconComponent = iconMap[tip.icon] || RestaurantIcon;
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    width: '100%', 
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 2,
                    padding: '0 5px',
                    height: '100%',
                  }}
                >
                  <Grow in={true} timeout={500}>
                    <TipCard index={index % recipeTips.length} sx={{ height: '100%' }}>
                      <StyledCardContent>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          marginBottom: 1,
                        }}>
                          <IconWrapper>
                            <Zoom in={true} timeout={500}>
                              <IconComponent 
                                sx={{ 
                                  color: 'white',
                                  fontSize: '1.5rem',
                                }}
                              />
                            </Zoom>
                          </IconWrapper>
                          <TitleWrapper>
                            <Typography 
                              variant="h6"
                              sx={{ 
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                fontSize: '1.2rem',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {tip.title}
                            </Typography>
                          </TitleWrapper>
                        </Box>
                        <DescriptionWrapper>
                          <Typography 
                            variant="body1"
                            sx={{ 
                              color: 'white',
                              fontSize: '1rem',
                              lineHeight: 1.6,
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                              letterSpacing: '0.01em',
                              paddingLeft: '8px',
                            }}
                          >
                            {tip.description}
                          </Typography>
                        </DescriptionWrapper>
                      </StyledCardContent>
                    </TipCard>
                  </Grow>
                </Box>
              );
            })}
          </CarouselTrack>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mt: 2,
              gap: 2,
              position: 'relative',
              zIndex: 3,
            }}
          >
            <IconButton 
              onClick={handlePrevRecipeTip} 
              sx={{ 
                '&:hover': { transform: 'scale(1.2)' },
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {currentRecipeTipIndex % recipeTips.length + 1} / {recipeTips.length}
            </Typography>
            <IconButton 
              onClick={handleNextRecipeTip} 
              sx={{ 
                '&:hover': { transform: 'scale(1.2)' },
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {recipe && (
        <RecipeCard>
          <CardMedia component="img" height="200" image={recipe.image} alt={recipe.title} />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {recipe.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {recipe.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Nutrition Information:
              </Typography>
              <Grid container spacing={1}>
                {recipe.nutritionInfo && (
                  <>
                    <Grid item>
                      <Chip label={`${recipe.nutritionInfo.calories} calories`} size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`${recipe.nutritionInfo.protein}g protein`} size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`${recipe.nutritionInfo.carbs}g carbs`} size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`${recipe.nutritionInfo.fat}g fat`} size="small" />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Ingredients:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {recipe.ingredients &&
                recipe.ingredients.map((ingredient, index) => (
                  <Grid item key={index}>
                    <Chip label={ingredient} size="small" />
                  </Grid>
                ))}
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
              Instructions:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              {recipe.instructions &&
                recipe.instructions.map((instruction, index) => (
                  <Typography component="li" key={index} variant="body2">
                    {instruction}
                  </Typography>
                ))}
            </Box>
          </CardContent>
        </RecipeCard>
      )}
    </StyledPaper>
  );

  const renderHealthAdvisor = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            AI Health Advisor
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Ask any nutrition or health-related question and get expert advice.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Ask your health question..."
              value={healthQuestion}
              onChange={(e) => setHealthQuestion(e.target.value)}
              error={!!aiError}
              helperText={aiError}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAskHealthQuestion}
              disabled={aiLoading}
              sx={{ minWidth: '120px' }}
            >
              {aiLoading ? <CircularProgress size={24} /> : 'Ask'}
            </Button>
          </Box>
          {aiResponse && (
            <Fade in={true} timeout={500}>
              <Card>
                <CardContent>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                    {aiResponse}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}
        </StyledPaper>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
            Nutrition Tips
          </Typography>
          {tipsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : nutritionTips.length > 0 ? (
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              overflow: 'hidden',
              height: '150px',
            }}>
              <CarouselTrack sx={{ 
                transform: `translateX(-${currentTipIndex * 100}%)`,
                display: 'flex',
                width: '100%',
                height: '100%',
              }}>
                {carouselItems.map((tip, index) => {
                  const IconComponent = iconMap[tip.icon] || RestaurantIcon;
                  return (
                    <Box 
                      key={index} 
                      sx={{ 
                        width: '100%', 
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 2,
                        padding: '0 5px',
                        height: '100%',
                      }}
                    >
                      <Grow in={true} timeout={500}>
                        <TipCard index={index % nutritionTips.length} sx={{ height: '100%' }}>
                          <StyledCardContent>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              marginBottom: 1,
                            }}>
                              <IconWrapper>
                                <Zoom in={true} timeout={500}>
                                  <IconComponent 
                                    sx={{ 
                                      color: 'white',
                                      fontSize: '1.5rem',
                                    }}
                                  />
                                </Zoom>
                              </IconWrapper>
                              <TitleWrapper>
                                <Typography 
                                  variant="h6"
                                  sx={{ 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    fontSize: '1.2rem',
                                    letterSpacing: '0.02em',
                                  }}
                                >
                                  {tip.title}
                                </Typography>
                              </TitleWrapper>
                            </Box>
                            <DescriptionWrapper>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  color: 'white',
                                  fontSize: '1rem',
                                  lineHeight: 1.6,
                                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                  letterSpacing: '0.01em',
                                  paddingLeft: '8px',
                                }}
                              >
                                {tip.description}
                              </Typography>
                            </DescriptionWrapper>
                          </StyledCardContent>
                        </TipCard>
                      </Grow>
                    </Box>
                  );
                })}
              </CarouselTrack>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 2,
                  gap: 2,
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                <IconButton 
                  onClick={handlePrevTip} 
                  disabled={tipsLoading}
                  sx={{ 
                    '&:hover': { transform: 'scale(1.2)' },
                    transition: 'transform 0.2s ease-in-out',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {currentTipIndex % nutritionTips.length + 1} / {nutritionTips.length}
                </Typography>
                <IconButton 
                  onClick={handleNextTip} 
                  disabled={tipsLoading}
                  sx={{ 
                    '&:hover': { transform: 'scale(1.2)' },
                    transition: 'transform 0.2s ease-in-out',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No nutrition tips available at the moment.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Nutrition Guide
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Recipe Generator" />
          <Tab label="Health Advisor" />
        </Tabs>
        <Divider sx={{ mb: 3 }} />
        {activeTab === 0 && renderRecipeGenerator()}
        {activeTab === 1 && renderHealthAdvisor()}
      </Container>
    </DashboardLayout>
  );
};

export default NutritionGuide;
