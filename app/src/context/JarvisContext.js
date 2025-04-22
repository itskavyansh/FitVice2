import React, { createContext, useContext, useState, useCallback } from 'react';
import jarvisInstructions from './AgentInstructions';
import jarvisService from '../services/jarvisService';

const JarvisContext = createContext();

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

  const value = {
    instructions: jarvisInstructions,
    conversationHistory,
    userPreferences,
    isProcessing,
    lastAction,
    addToConversation,
    updateUserPreferences,
    clearConversation,
    getJarvisResponse,
    handleTaskCreation,
    handleWorkoutPlanning,
    handleMealPlanning,
  };

  return (
    <JarvisContext.Provider value={value}>
      {children}
    </JarvisContext.Provider>
  );
};

export default JarvisContext; 