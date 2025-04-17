// Assume this base URL points to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; // CORRECTED PORT

// Helper to get auth token (replace with your actual implementation)

// Export the class directly
export class FitViceApiService {
  constructor() {}

  // ... (methods: generateRecipe, askHealthQuestion, getNutritionTips) ...

  async generateRecipe(ingredients) {
    try {
      const token = getAuthToken();
      // Add /api prefix back
      const response = await fetch(`${API_BASE_URL}/api/recipes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients })
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
      // Add /api prefix back
      const response = await fetch(`${API_BASE_URL}/api/jarvis/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ command: question, history: history })
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
      // Add /api prefix back
      const response = await fetch(`${API_BASE_URL}/api/jarvis/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ command: command, history: history })
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