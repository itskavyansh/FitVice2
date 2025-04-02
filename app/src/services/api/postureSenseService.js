import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const PostureSenseService = {
  // Save workout data to backend
  saveWorkout: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error.response?.data || { message: 'Failed to save workout data' };
    }
  },

  // Get workout history for the current user
  getWorkoutHistory: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout history:', error);
      throw error.response?.data || { message: 'Failed to fetch workout history' };
    }
  },

  // Delete a specific workout
  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error.response?.data || { message: 'Failed to delete workout' };
    }
  },

  // Get workout statistics
  getWorkoutStats: async () => {
    try {
      const response = await api.get('/workouts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout stats:', error);
      throw error.response?.data || { message: 'Failed to fetch workout statistics' };
    }
  }
};

export default PostureSenseService; 