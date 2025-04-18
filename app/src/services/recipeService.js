import axios from 'axios';

// Use relative paths - Netlify proxy will handle routing
const API_URL = '/api';

const generateRecipe = async (ingredients) => {
  try {
    // Uses relative path: /api/recipes/generate
    const response = await axios.post(`${API_URL}/recipes/generate`, {
      ingredients,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to generate recipe. Please try again.',
    );
  }
};

export { generateRecipe };
