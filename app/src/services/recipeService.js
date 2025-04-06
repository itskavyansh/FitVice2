import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const generateRecipe = async (ingredients) => {
  try {
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
