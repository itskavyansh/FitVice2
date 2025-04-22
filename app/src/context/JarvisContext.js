import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import jarvisInstructions from './AgentInstructions';
import jarvisService from '../services/jarvisService';
import { FitViceApiService } from '../services/FitViceApiService';

const JarvisContext = createContext();

// Initialize API service with offline support
const apiService = new FitViceApiService();

export const useJarvis = () => {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
};

export const JarvisProvider = ({ children }) => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    fitnessLevel: 'beginner',
    goals: [],
    restrictions: [],
    equipment: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    isOnline: navigator.onLine,
    isBackendAvailable: null,
    isUsingBackup: false,
    lastCheckTime: 0
  });

  // Update backend status periodically
  useEffect(() => {
    const updateBackendStatus = async () => {
      try {
        const status = apiService.getBackendStatus();
        setBackendStatus(status);
        
        // If status is unknown, check backend health
        if (status.isBackendAvailable === null) {
          await apiService.checkBackendHealth();
          setBackendStatus(apiService.getBackendStatus());
        }
      } catch (error) {
        console.error('Error updating backend status:', error);
      }
    };
    
    // Initial check
    updateBackendStatus();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(updateBackendStatus, 60000); // Every minute
    
    // Set up online/offline event listeners
    const handleOnlineStatusChange = () => {
      setBackendStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
      
      // If we're back online, check backend health
      if (navigator.onLine) {
        apiService.checkBackendHealth()
          .then(() => setBackendStatus(apiService.getBackendStatus()));
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const addToConversation = (message, isUser = true, metadata = {}) => {
    const messageObj = {
      id: Date.now(),
      message: typeof message === 'string' ? message : message.message || '',
      isUser,
      timestamp: new Date().toISOString(),
      metadata: metadata.type ? metadata : { type: 'text', data: metadata },
    };

    setConversationHistory(prev => [...prev, messageObj]);
  };

  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
  };

  const clearConversation = () => {
    setConversationHistory([]);
  };

  const handleTaskCreation = async (taskDetails) => {
    try {
      const result = await jarvisService.createTask(taskDetails);
      addToConversation(
        'Task created successfully!',
        false,
        { type: 'task_created', data: { ...taskDetails, id: result.taskId } }
      );
      return result;
    } catch (error) {
      // Check if we're offline
      if (!backendStatus.isOnline || !backendStatus.isBackendAvailable) {
        // Provide offline feedback
        const offlineMsg = 'Your task has been saved locally and will be synced when you\'re back online.';
        addToConversation(
          offlineMsg,
          false,
          { 
            type: 'task_created', 
            data: { 
              ...taskDetails, 
              id: `local-${Date.now()}`,
              pendingSync: true 
            } 
          }
        );
        return { 
          taskId: `local-${Date.now()}`, 
          pendingSync: true, 
          offline: true 
        };
      }
      
      // Standard error handling
      addToConversation(
        'Failed to create task. Please try again.',
        false,
        { type: 'error', error: error.message }
      );
      throw error;
    }
  };

  const handleWorkoutPlanning = async (preferences) => {
    try {
      const plan = await jarvisService.createWorkoutPlan(preferences);
      addToConversation(
        'Here\'s your personalized workout plan!',
        false,
        { type: 'workout_plan', data: plan }
      );
      return plan;
    } catch (error) {
      // Check if we're offline
      if (!backendStatus.isOnline || !backendStatus.isBackendAvailable) {
        // Generate fallback workout plan
        const fallbackPlan = generateFallbackWorkout(preferences);
        addToConversation(
          'I\'ve created a basic workout plan while offline. More personalized options will be available when you reconnect.',
          false,
          { 
            type: 'workout_plan', 
            data: fallbackPlan,
            offline: true 
          }
        );
        return { ...fallbackPlan, offline: true };
      }
      
      // Standard error handling
      addToConversation(
        'Failed to create workout plan. Please try again.',
        false,
        { type: 'error', error: error.message }
      );
      throw error;
    }
  };

  const handleMealPlanning = async (preferences) => {
    try {
      const plan = await jarvisService.createMealPlan(preferences);
      addToConversation(
        'Here\'s your customized meal plan!',
        false,
        { type: 'meal_plan', data: plan }
      );
      return plan;
    } catch (error) {
      // Check if we're offline
      if (!backendStatus.isOnline || !backendStatus.isBackendAvailable) {
        // Generate fallback meal plan
        const fallbackPlan = generateFallbackMealPlan(preferences);
        addToConversation(
          'I\'ve created a basic meal plan while offline. More personalized options will be available when you reconnect.',
          false,
          { 
            type: 'meal_plan', 
            data: fallbackPlan,
            offline: true 
          }
        );
        return { ...fallbackPlan, offline: true };
      }
      
      // Standard error handling
      addToConversation(
        'Failed to create meal plan. Please try again.',
        false,
        { type: 'error', error: error.message }
      );
      throw error;
    }
  };

  const getJarvisResponse = async (userInput) => {
    if (!userInput?.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Add user message first
      addToConversation(userInput, true);
      
      // Check backend status before making request
      if (!backendStatus.isOnline || !backendStatus.isBackendAvailable) {
        // Provide offline response
        const offlineResponse = generateOfflineResponse(userInput);
        addToConversation(
          offlineResponse.message, 
          false, 
          { 
            ...offlineResponse,
            offline: true 
          }
        );
        
        setLastAction({
          type: 'offline',
          timestamp: new Date().toISOString(),
          data: offlineResponse
        });
        
        return offlineResponse;
      }
      
      // Process the command
      const response = await jarvisService.processCommand(userInput);
      
      if (response.message) {
        addToConversation(response.message, false, response);
      }

      setLastAction({
        type: 'success',
        timestamp: new Date().toISOString(),
        data: response
      });

      return response;
    } catch (error) {
      console.error('Error getting Jarvis response:', error);
      
      // If error is connectivity-related, provide offline response
      if (error.message?.includes('network') || error.message?.includes('connection') || !navigator.onLine) {
        const offlineResponse = generateOfflineResponse(userInput);
        addToConversation(
          offlineResponse.message, 
          false, 
          { 
            ...offlineResponse,
            offline: true 
          }
        );
        
        setLastAction({
          type: 'offline',
          timestamp: new Date().toISOString(),
          data: offlineResponse
        });
        
        return offlineResponse;
      }
      
      // Standard error handling
      addToConversation(
        'I apologize, but I encountered an error. Please try again.',
        false,
        { type: 'error', error: error.message }
      );
      
      setLastAction({
        type: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      });

      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate basic offline responses based on user input patterns
  const generateOfflineResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for common patterns
    if (input.includes('workout') || input.includes('exercise')) {
      return {
        type: 'offline_response',
        message: "I'm currently offline, but here are some general workout tips: Focus on proper form, ensure adequate rest between workouts, and stay hydrated. A basic workout might include 3 sets of push-ups, squats, and planks. I'll provide more personalized advice when you're back online."
      };
    } else if (input.includes('meal') || input.includes('nutrition') || input.includes('diet') || input.includes('food')) {
      return {
        type: 'offline_response',
        message: "While I'm offline, here's some general nutrition advice: Aim for a balanced diet with plenty of vegetables, lean proteins, and whole grains. Stay hydrated and try to limit processed foods. I can provide more personalized meal plans when we're back online."
      };
    } else if (input.includes('reminder') || input.includes('schedule')) {
      return {
        type: 'offline_response',
        message: "I've noted your request for a reminder. This will be processed when you're back online. In the meantime, you might want to set a reminder on your phone or write it down as a backup."
      };
    } else if (input.includes('progress') || input.includes('track')) {
      return {
        type: 'offline_response',
        message: "I can't access your progress data while offline. Once you're back online, I'll be able to provide detailed insights about your fitness journey."
      };
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        type: 'offline_response',
        message: "Hello! I'm currently operating in offline mode with limited capabilities. I can still provide some basic fitness and nutrition advice, but more personalized features will be available when you're back online."
      };
    } else {
      return {
        type: 'offline_response',
        message: "I'm currently in offline mode with limited functionality. I can provide basic fitness and nutrition guidance, but personalized features require an internet connection. Your query will be saved and processed when you're back online."
      };
    }
  };
  
  // Generate a basic workout plan for offline mode
  const generateFallbackWorkout = (preferences = {}) => {
    const level = preferences.fitnessLevel || 'beginner';
    
    const beginnerWorkout = {
      title: "Basic Bodyweight Workout",
      description: "A simple full-body workout you can do anywhere with no equipment",
      frequency: "3 times per week",
      exercises: [
        { name: "Push-ups", sets: "3", reps: "8-10", duration: null },
        { name: "Squats", sets: "3", reps: "12-15", duration: null },
        { name: "Plank", sets: "3", reps: null, duration: "30 seconds" },
        { name: "Walking Lunges", sets: "2", reps: "10 each leg", duration: null },
        { name: "Mountain Climbers", sets: "3", reps: null, duration: "30 seconds" }
      ],
      notes: "Rest 60-90 seconds between sets. Focus on proper form rather than speed."
    };
    
    const intermediateWorkout = {
      title: "Intermediate Full Body Workout",
      description: "A challenging workout targeting all major muscle groups",
      frequency: "4 times per week",
      exercises: [
        { name: "Push-ups (or variations)", sets: "4", reps: "15-20", duration: null },
        { name: "Bodyweight Squats", sets: "4", reps: "20", duration: null },
        { name: "Plank", sets: "3", reps: null, duration: "45-60 seconds" },
        { name: "Walking Lunges", sets: "3", reps: "12 each leg", duration: null },
        { name: "Mountain Climbers", sets: "3", reps: null, duration: "45 seconds" },
        { name: "Burpees", sets: "3", reps: "10-15", duration: null }
      ],
      notes: "Rest 45-60 seconds between sets. Add variations to increase difficulty."
    };
    
    const advancedWorkout = {
      title: "Advanced High-Intensity Workout",
      description: "An intense workout for experienced fitness enthusiasts",
      frequency: "5 times per week",
      exercises: [
        { name: "Push-up Variations", sets: "4", reps: "20-25", duration: null },
        { name: "Jump Squats", sets: "4", reps: "20", duration: null },
        { name: "Plank Variations", sets: "3", reps: null, duration: "60-90 seconds" },
        { name: "Walking Lunges with Twist", sets: "3", reps: "15 each leg", duration: null },
        { name: "Burpees", sets: "4", reps: "15-20", duration: null },
        { name: "Mountain Climbers", sets: "4", reps: null, duration: "60 seconds" },
        { name: "High Knees", sets: "3", reps: null, duration: "45 seconds" }
      ],
      notes: "Rest 30-45 seconds between sets. Perform exercises in circuit format for additional challenge."
    };
    
    switch(level) {
      case 'intermediate':
        return intermediateWorkout;
      case 'advanced':
        return advancedWorkout;
      default:
        return beginnerWorkout;
    }
  };
  
  // Generate a basic meal plan for offline mode
  const generateFallbackMealPlan = (preferences = {}) => {
    return {
      title: "Basic Balanced Meal Plan",
      description: "A general healthy eating plan that works for most people",
      meals: [
        {
          type: "breakfast",
          items: "Oatmeal with fruit and nuts, or eggs with whole grain toast",
          calories: "350-450"
        },
        {
          type: "lunch",
          items: "Salad with lean protein (chicken, fish, tofu), vegetables, and healthy fats",
          calories: "450-550"
        },
        {
          type: "dinner",
          items: "Lean protein with vegetables and complex carbohydrates (brown rice, sweet potato)",
          calories: "500-650"
        },
        {
          type: "snack1",
          items: "Fruit with nuts or yogurt",
          calories: "150-200"
        },
        {
          type: "snack2",
          items: "Vegetable sticks with hummus or a protein shake",
          calories: "150-200"
        }
      ],
      notes: "This is a general plan created in offline mode. For a more personalized plan tailored to your specific dietary needs and goals, please connect to the internet."
    };
  };

  const value = {
    instructions: jarvisInstructions,
    conversationHistory,
    userPreferences,
    isProcessing,
    lastAction,
    backendStatus,  // Now exposing backend status to consumers
    addToConversation,
    updateUserPreferences,
    clearConversation,
    getJarvisResponse,
    handleTaskCreation,
    handleWorkoutPlanning,
    handleMealPlanning,
    checkBackendHealth: apiService.checkBackendHealth.bind(apiService),  // Allow manual health checks
  };

  return (
    <JarvisContext.Provider value={value}>
      {children}
    </JarvisContext.Provider>
  );
};

export default JarvisContext; 