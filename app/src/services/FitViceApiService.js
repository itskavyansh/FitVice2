import apiConfig from './apiConfig';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token') || '';

// Export the class directly
export class FitViceApiService {
  constructor() {}

  // ... (methods: generateRecipe, askHealthQuestion, getNutritionTips) ...

  async generateRecipe(ingredients) {
    try {
      const token = getAuthToken();
      // Use recipes endpoint from apiConfig
      const response = await fetch(`${apiConfig.RECIPES_ENDPOINT}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to generate recipe via backend');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error generating recipe via backend:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while generating the recipe.'
      };
    }
  }

  async askHealthQuestion(question, history = []) {
    try {
      const token = getAuthToken();
      // Use jarvis endpoint from apiConfig
      const response = await fetch(`${apiConfig.JARVIS_ENDPOINT}/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ command: question, history: history }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get health advice via backend');
      }

      if (result.type === 'general_response') {
        return {
          success: true,
          data: result.message,
        };
      } else {
        throw new Error(result.message || 'Unexpected response format from backend.');
      }
    } catch (error) {
      console.error('Error getting health advice via backend:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while asking the health question.'
      };
    }
  }

  async getNutritionTips(history = []) {
    try {
      const token = getAuthToken();
      const command = "Generate 5 nutrition tips for general health.";
      // Use jarvis endpoint from apiConfig
      const response = await fetch(`${apiConfig.JARVIS_ENDPOINT}/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ command: command, history: history }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get nutrition tips via backend');
      }

      if (result.type === 'general_response') {
        return {
          success: true,
          data: result.message,
        };
      } else {
        throw new Error(result.message || 'Unexpected response format for nutrition tips.');
      }
    } catch (error) {
      console.error('Error getting nutrition tips via backend:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while fetching nutrition tips.'
      };
    }
  }

}

// Remove instance creation and export from here
// const fitViceApiService = new FitViceApiService();
// export { fitViceApiService }; 