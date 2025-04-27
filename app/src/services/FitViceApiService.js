import apiConfig from './apiConfig';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token') || '';

// Export the class directly
export class FitViceApiService {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 2;
  }

  /**
   * Common wrapper for API calls with built-in retry logic and fallback handling
   */
  async apiCallWithRetry(endpoint, options, fallbackGenerator = null) {
    let lastError = null;

    // Try up to maxRetries + 1 times (initial attempt + retries)
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Get the current backend URL from the config
        const endpointUrl = endpoint;
        console.log(`Attempt ${attempt + 1}/${this.maxRetries + 1} to ${endpointUrl}`);

        // Make the API call
        const response = await fetch(endpointUrl, options);
        const result = await response.json();

        // If successful, reset retry count and return result
        if (response.ok && result.success !== false) {
          this.retryCount = 0;
          return { success: true, data: result.data || result };
        }

        // If we got a response but it indicates failure
        throw new Error(result.message || `API returned error status: ${response.status}`);
      } catch (error) {
        console.warn(`API call failed (attempt ${attempt + 1}):`, error.message);
        lastError = error;

        // Mark current backend as unavailable and try to switch to next
        const nextBackend = apiConfig.markBackendUnavailable();
        if (!nextBackend && attempt < this.maxRetries) {
          // No more backends but still have retries - wait and try again
          console.log('No alternative backends, waiting before retry...');
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        } else if (!nextBackend && fallbackGenerator) {
          // No more backends and no more retries, but we have a fallback
          console.log('Using client-side fallback generator');
          return fallbackGenerator();
        }
      }
    }

    // If we have a fallback, use it
    if (fallbackGenerator) {
      console.log('Using client-side fallback generator after all retries failed');
      return fallbackGenerator();
    }

    // All retries failed and no fallback available
    return {
      success: false,
      message: lastError?.message || 'Service unavailable after multiple attempts',
    };
  }

  async generateRecipe(ingredients) {
    const token = getAuthToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ingredients }),
      credentials: 'include',
    };

    // Create a fallback recipe generator that works offline
    const fallbackGenerator = () => {
      const mainIngredient = ingredients.split(',')[0].trim();
      const capitalizedIngredient =
        mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1);

      return {
        success: true,
        data: {
          title: `Simple ${capitalizedIngredient} Recipe`,
          description: `A healthy recipe featuring ${ingredients}. This recipe was generated offline.`,
          ingredients: ingredients.split(',').map((i) => `${i.trim()} - as needed`),
          instructions: [
            `Prepare ${mainIngredient} and other ingredients`,
            'Cook according to your preference',
            'Enjoy your meal!',
          ],
          nutritionInfo: {
            calories: '350',
            protein: '15g',
            carbs: '40g',
            fat: '10g',
          },
          image: `https://source.unsplash.com/800x600/?food,${mainIngredient}`,
        },
      };
    };

    return this.apiCallWithRetry(
      apiConfig.RECIPES_ENDPOINT + '/generate',
      options,
      fallbackGenerator,
    );
  }

  async askHealthQuestion(question, history = []) {
    const token = getAuthToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ command: question, history: history }),
      credentials: 'include',
    };

    // Create a fallback health advice generator
    const fallbackGenerator = () => {
      return {
        success: true,
        data: `I'm currently offline, but here's some general advice: ${getGeneralAdvice(question)}`,
      };
    };

    return this.apiCallWithRetry(
      apiConfig.JARVIS_ENDPOINT + '/command',
      options,
      fallbackGenerator,
    );
  }

  async getNutritionTips(history = []) {
    const token = getAuthToken();
    const command = 'Generate 5 nutrition tips for general health.';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ command: command, history: history }),
      credentials: 'include',
    };

    // Create fallback nutrition tips
    const fallbackGenerator = () => {
      return {
        success: true,
        data: [
          {
            title: 'Stay Hydrated',
            description:
              'Drink at least 8 glasses of water daily to maintain optimal body function.',
            icon: 'WaterDrop',
          },
          {
            title: 'Balanced Diet',
            description:
              'Include a variety of fruits, vegetables, proteins, and whole grains in your meals.',
            icon: 'Restaurant',
          },
          {
            title: 'Portion Control',
            description:
              'Be mindful of portion sizes to maintain a healthy weight and energy levels.',
            icon: 'LocalDining',
          },
          {
            title: 'Regular Exercise',
            description: 'Combine good nutrition with regular physical activity for best results.',
            icon: 'FitnessCenter',
          },
          {
            title: 'Limit Processed Foods',
            description:
              'Reduce intake of processed foods high in sugar, salt, and unhealthy fats.',
            icon: 'HealthAndSafety',
          },
        ],
      };
    };

    return this.apiCallWithRetry(
      apiConfig.JARVIS_ENDPOINT + '/command',
      options,
      fallbackGenerator,
    );
  }
}

// Helper function for offline health advice
function getGeneralAdvice(question) {
  question = question.toLowerCase();

  if (question.includes('workout') || question.includes('exercise')) {
    return 'For general fitness, aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly, plus strength training twice a week.';
  } else if (
    question.includes('diet') ||
    question.includes('nutrition') ||
    question.includes('food')
  ) {
    return 'A balanced diet should include plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt.';
  } else if (question.includes('sleep')) {
    return 'Most adults need 7-9 hours of quality sleep per night. Establish a regular sleep schedule and create a restful environment for better sleep.';
  } else if (question.includes('water') || question.includes('hydration')) {
    return "Stay hydrated by drinking about 8 glasses (64 ounces) of water daily, more if you're active or in hot weather.";
  }

  return 'For personalized health advice, please reconnect when online. In the meantime, focus on balanced nutrition, regular exercise, adequate sleep, and stress management for overall wellbeing.';
}

// Remove instance creation and export from here
// const fitViceApiService = new FitViceApiService();
// export { fitViceApiService };
