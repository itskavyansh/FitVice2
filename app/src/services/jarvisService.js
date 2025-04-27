import apiConfig from './apiConfig';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token') || '';

class JarvisService {
  constructor() {
    // Keep history management in the frontend service
    this.conversationHistory = [];
    // No API key needed here anymore
  }

  // Removed initializeAPI method

  async processCommand(userInput) {
    try {
      const token = getAuthToken();
      if (!token) {
        // Handle cases where user is not logged in, maybe redirect or show message
        console.warn('User not authenticated, cannot process command requiring auth.');
        return {
          type: 'error',
          message: 'Please log in to use Jarvis features.',
        };
      }

      // 1. Add user message to local history BEFORE sending
      const userMessage = { role: 'user', content: userInput };
      this.conversationHistory.push(userMessage);
      // Keep history relatively short for API calls
      const historyToSend = this.conversationHistory.slice(-10);

      // Use jarvis endpoint from apiConfig
      const targetUrl = `${apiConfig.JARVIS_ENDPOINT}/command`;
      console.log(`[JarvisService] Attempting to fetch: ${targetUrl}`); // Log the exact URL
      console.log(
        '[JarvisService] Request Body:',
        JSON.stringify({ command: userInput, history: historyToSend }),
      ); // Log the body

      // 2. Call the backend /command endpoint
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          command: userInput,
          history: historyToSend,
        }),
        credentials: 'include',
      });

      console.log(`[JarvisService] Fetch response status: ${response.status}`); // Log status
      const responseText = await response.text(); // Get raw response text first
      console.log('[JarvisService] Raw response text:', responseText.substring(0, 500) + '...'); // Log raw response (truncated)

      // Try to parse as JSON *after* logging raw text
      const result = JSON.parse(responseText);

      if (!response.ok) {
        console.error('Backend Error:', result);
        throw new Error(result.error || result.message || 'Failed to get response from backend');
      }

      // 3. Add assistant response from backend to local history
      // Ensure we add the actual message content, not just the confirmation
      if (result.message) {
        const assistantMessage = { role: 'assistant', content: result.message };
        this.conversationHistory.push(assistantMessage);
      }

      // 4. Return the backend response (contains message, type, and potentially data)
      return {
        type: result.type || 'unknown', // Type determined by backend (general_response, workout_plan etc.)
        message: result.message, // The actual response content for the user
        data: result.data, // Optional structured data (task, plan etc.)
      };
    } catch (error) {
      // Log the error which might now include the raw text if parsing failed
      console.error('[JarvisService] Error processing command via backend:', error);
      return {
        type: 'error',
        message: error.message || 'An error occurred processing your request. Please try again.',
      };
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new JarvisService();
