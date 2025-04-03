import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import SearchIcon from "@mui/icons-material/Search";
import { generateRecipe } from "services/recipeService";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

const RecipeCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "15px",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const NutritionGuide = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await generateRecipe(ingredients);
      if (response.success) {
        setRecipe(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeGenerator = () => (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        AI Recipe Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter your ingredients and let our AI create a healthy recipe for you!
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
          sx={{ minWidth: "120px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Recipe"}
        </Button>
      </Box>

      {recipe && (
        <RecipeCard>
          <CardMedia
            component="img"
            height="200"
            image={recipe.image}
            alt={recipe.title}
          />
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
                <Grid item>
                  <Chip
                    label={`${recipe.nutritionInfo.calories} calories`}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={`${recipe.nutritionInfo.protein} protein`}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={`${recipe.nutritionInfo.carbs} carbs`}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={`${recipe.nutritionInfo.fat} fat`}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Ingredients:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <Grid item key={index}>
                  <Chip label={ingredient} size="small" />
                </Grid>
              ))}
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
              Instructions:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              {recipe.instructions.map((instruction, index) => (
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

  const renderNutritionTips = () => (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        Nutrition Tips
      </Typography>
      <Grid container spacing={3}>
        {[
          {
            title: "Eat the Rainbow",
            description:
              "Include a variety of colorful fruits and vegetables in your diet to ensure you get a wide range of nutrients.",
            icon: <FoodBankIcon />,
          },
          {
            title: "Stay Hydrated",
            description:
              "Drink plenty of water throughout the day. Aim for at least 8 glasses of water daily.",
            icon: <LocalDiningIcon />,
          },
          {
            title: "Mindful Eating",
            description:
              "Pay attention to your hunger and fullness cues. Eat slowly and savor your food.",
            icon: <RestaurantIcon />,
          },
        ].map((tip, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {tip.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {tip.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {tip.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </StyledPaper>
  );

  const renderMacroCalculator = () => (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        Macro Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate your daily macronutrient needs based on your goals.
      </Typography>
      {/* TODO: Implement macro calculator */}
      <Typography variant="body2" color="text.secondary">
        Coming soon...
      </Typography>
    </StyledPaper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nutrition Guide
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Recipe Generator" />
        <Tab label="Nutrition Tips" />
        <Tab label="Macro Calculator" />
      </Tabs>
      <Divider sx={{ mb: 3 }} />
      {activeTab === 0 && renderRecipeGenerator()}
      {activeTab === 1 && renderNutritionTips()}
      {activeTab === 2 && renderMacroCalculator()}
    </Container>
  );
};

export default NutritionGuide; 