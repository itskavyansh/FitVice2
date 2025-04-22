import axios from 'axios';
import { getApiConfig } from './apiConfig';

// Helper class to manage backend status
class BackendStatusManager {
  constructor() {
    const config = getApiConfig();
    
    this.status = {
      isOnline: navigator.onLine,
      isBackendAvailable: null,
      isUsingBackup: false,
      currentBackendUrl: config.apiBaseUrl,
      backupEndpoints: config.backupEndpoints,
      lastCheckTime: 0,
      pendingRequests: [],
      connectionAttempts: 0,
      healthCheckInterval: null
    };

    // Set up online/offline listeners
    window.addEventListener('online', this.handleOnlineStatusChange.bind(this));
    window.addEventListener('offline', this.handleOnlineStatusChange.bind(this));
    
    // Start periodic health checks
    this.startPeriodicHealthCheck();
  }

  startPeriodicHealthCheck() {
    // Clear any existing interval
    if (this.status.healthCheckInterval) {
      clearInterval(this.status.healthCheckInterval);
    }
    
    // Start a new interval - check every 30 seconds when online, 2 minutes when using backup
    const interval = this.status.isUsingBackup ? 120000 : 30000;
    this.status.healthCheckInterval = setInterval(() => {
      if (navigator.onLine) {
        // Only trigger a check if we've been using a backup or having issues
        if (this.status.isUsingBackup || this.status.isBackendAvailable === false) {
          window.dispatchEvent(new CustomEvent('backendHealthCheck'));
        }
      }
    }, interval);
  }

  handleOnlineStatusChange() {
    const wasOffline = !this.status.isOnline;
    this.status.isOnline = navigator.onLine;
    
    // If we're back online after being offline, trigger health check and process pending
    if (navigator.onLine && wasOffline) {
      window.dispatchEvent(new CustomEvent('backendHealthCheck'));
      setTimeout(() => this.processPendingRequests(), 2000);
    }
    
    // Adjust the health check interval based on connection status
    this.startPeriodicHealthCheck();
  }

  async processPendingRequests() {
    if (this.status.pendingRequests.length === 0) return;
    
    try {
      // Process each pending request in batches to avoid overwhelming the backend
      const BATCH_SIZE = 5;
      console.log(`Processing ${this.status.pendingRequests.length} pending requests in batches of ${BATCH_SIZE}`);
      
      // Create a copy of the pending requests
      const allPendingRequests = [...this.status.pendingRequests];
      this.status.pendingRequests = [];
      
      // Process in batches
      for (let i = 0; i < allPendingRequests.length; i += BATCH_SIZE) {
        const batch = allPendingRequests.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (request) => {
          try {
            const result = await request.execute();
            if (request.onSuccess) {
              request.onSuccess(result);
            }
            return { success: true, request };
          } catch (error) {
            console.error('Error processing pending request:', error);
            if (request.onError) {
              request.onError(error);
            }
            
            // Only requeue network errors, not validation or server errors
            if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
              return { success: false, request, requeue: true };
            }
            return { success: false, request, requeue: false };
          }
        });
        
        // Wait for the batch to complete
        const results = await Promise.all(promises);
        
        // Requeue failed requests that should be retried
        results
          .filter(r => !r.success && r.requeue)
          .forEach(r => this.status.pendingRequests.push(r.request));
        
        // Pause between batches to avoid overwhelming the server
        if (i + BATCH_SIZE < allPendingRequests.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Error in batch processing of pending requests:', error);
    }
  }

  getStatus() {
    return { 
      available: this.status.isBackendAvailable === true,
      usingBackup: this.status.isUsingBackup,
      currentUrl: this.status.currentBackendUrl,
      timestamp: this.status.lastCheckTime,
      pendingCount: this.status.pendingRequests.length,
      attempts: this.status.connectionAttempts,
      isOnline: this.status.isOnline
    };
  }

  setBackendAvailable(isAvailable, isUsingBackup = false, backendUrl = null) {
    const wasUnavailable = this.status.isBackendAvailable === false;
    
    this.status.isBackendAvailable = isAvailable;
    this.status.isUsingBackup = isUsingBackup;
    
    if (backendUrl) {
      this.status.currentBackendUrl = backendUrl;
    }
    
    this.status.lastCheckTime = Date.now();
    
    // If backend becomes available after being unavailable, process pending requests
    if (isAvailable && wasUnavailable) {
      this.processPendingRequests();
    }
    
    // Reset connection attempts on successful connection
    if (isAvailable) {
      this.status.connectionAttempts = 0;
    } else {
      this.status.connectionAttempts++;
    }
    
    // Dispatch event so UI can update
    window.dispatchEvent(new CustomEvent('backend-status-change', { 
      detail: this.getStatus() 
    }));
    
    // Update health check interval based on status
    this.startPeriodicHealthCheck();
  }

  addPendingRequest(request) {
    // Add request to queue and deduplicate if identical requests exist
    const requestKey = JSON.stringify({
      url: request.url,
      method: request.method,
      data: request.data
    });
    
    // Check if we already have this exact request in the queue
    const existingRequestIndex = this.status.pendingRequests.findIndex(req => 
      JSON.stringify({
        url: req.url,
        method: req.method, 
        data: req.data
      }) === requestKey
    );
    
    if (existingRequestIndex >= 0) {
      // Replace the existing request with this one (which might have updated callbacks)
      this.status.pendingRequests[existingRequestIndex] = request;
    } else {
      // Add as a new request
      this.status.pendingRequests.push(request);
    }
    
    // Notify that pending requests have changed
    window.dispatchEvent(new CustomEvent('pending-requests-change', {
      detail: { count: this.status.pendingRequests.length }
    }));
  }
}

// Create a singleton instance
const backendStatusManager = new BackendStatusManager();

export class FitViceApiService {
  constructor() {
    const config = getApiConfig();
    
    this.primaryApiUrl = config.apiBaseUrl;
    this.backupApiUrls = config.backupEndpoints;
    this.healthEndpoint = config.healthEndpoint || '/health';
    this.timeout = config.timeout || 15000;
    this.maxRetries = config.retryAttempts || 2;
    
    this.client = axios.create({
      baseURL: this.primaryApiUrl,
      timeout: this.timeout
    });
    
    // Add a request interceptor to handle offline mode and auth tokens
    this.client.interceptors.request.use(
      (config) => {
        // Check if we have a token and add it to the request
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add a timestamp to prevent caching issues
        config.params = config.params || {};
        config.params._ts = Date.now();
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add a response interceptor to detect backend availability
    this.client.interceptors.response.use(
      (response) => {
        // Update backend status on successful response
        backendStatusManager.setBackendAvailable(true, 
                                               this.client.defaults.baseURL !== this.primaryApiUrl, 
                                               this.client.defaults.baseURL);
        return response;
      },
      (error) => {
        // Check if error is due to network issues
        if (!error.response) {
          backendStatusManager.setBackendAvailable(false);
        } else if (error.response.status >= 500) {
          // Server errors might indicate backend issues
          console.error('Server error detected:', error.response.status);
        }
        return Promise.reject(error);
      }
    );
    
    // Listen for health check events
    window.addEventListener('backendHealthCheck', () => {
      this.checkBackendHealth().catch(err => console.error('Health check error:', err));
    });
    
    // Perform initial health check
    setTimeout(() => this.checkBackendHealth(), 1000);
  }

  getBackendStatus() {
    return backendStatusManager.getStatus();
  }

  getPendingRequestsCount() {
    return backendStatusManager.status.pendingRequests.length;
  }
  
  async checkBackendAvailability() {
    return this.checkBackendHealth();
  }
  
  processPendingRequests() {
    return backendStatusManager.processPendingRequests();
  }

  async checkBackendHealth() {
    // Don't check if offline
    if (!navigator.onLine) {
      backendStatusManager.setBackendAvailable(false);
      return { available: false, message: 'Device is offline' };
    }
    
    // Try primary endpoint first if we're not already using it successfully
    if (this.client.defaults.baseURL !== this.primaryApiUrl || 
        backendStatusManager.getStatus().isBackendAvailable !== true) {
      try {
        console.log('Checking primary backend health...');
        const response = await axios.get(`${this.primaryApiUrl}${this.healthEndpoint}`, { 
          timeout: 5000,
          params: { _ts: Date.now() } // Prevent caching
        });
        
        if (response.status === 200) {
          console.log('Primary backend is available');
          // Switch back to primary if we were using backup
          this.client.defaults.baseURL = this.primaryApiUrl;
          backendStatusManager.setBackendAvailable(true, false, this.primaryApiUrl);
          return { available: true, message: 'Primary backend is available' };
        }
      } catch (error) {
        console.log('Primary backend health check failed:', error.message);
      }
    } else {
      // Already using primary backend successfully
      return { available: true, message: 'Already using primary backend' };
    }
    
    // Try backup endpoints if primary fails
    for (const backupUrl of this.backupApiUrls) {
      try {
        console.log(`Checking backup backend health: ${backupUrl}`);
        const response = await axios.get(`${backupUrl}${this.healthEndpoint}`, { 
          timeout: 5000,
          params: { _ts: Date.now() } // Prevent caching
        });
        
        if (response.status === 200) {
          console.log(`Backup backend is available: ${backupUrl}`);
          // Update client baseURL to use the working backup
          this.client.defaults.baseURL = backupUrl;
          backendStatusManager.setBackendAvailable(true, true, backupUrl);
          return { available: true, message: 'Backup backend is available', usingBackup: true };
        }
      } catch (error) {
        console.log(`Backup backend health check failed for ${backupUrl}:`, error.message);
      }
    }
    
    // All backends unavailable
    backendStatusManager.setBackendAvailable(false);
    return { available: false, message: 'All backends are unavailable' };
  }

  // Helper method to execute API calls with fallback functionality
  async executeWithFallback(apiMethod, options = {}) {
    const { 
      useLocalFallback = true,
      localFallbackData = null,
      shouldQueue = true,
      retries = this.maxRetries,
      endpoint = '',
      method = 'GET',
      data = null
    } = options;
    
    // Check if we're online
    if (!navigator.onLine) {
      if (useLocalFallback && localFallbackData) {
        return { ...localFallbackData, offline: true };
      }
      
      // If we should queue for later and have method details
      if (shouldQueue && endpoint) {
        this.queueRequest({ endpoint, method, data, options });
      }
      
      throw new Error('Device is offline and no fallback data available');
    }
    
    // Check backend status and try to reconnect if needed
    const status = backendStatusManager.getStatus();
    if (status.isBackendAvailable === false && status.connectionAttempts < 3) {
      await this.checkBackendHealth();
    }

    // Try to execute the API call
    let lastError = null;
    let currentRetry = 0;
    
    while (currentRetry <= retries) {
      try {
        return await apiMethod();
      } catch (error) {
        lastError = error;
        
        // If this was a connection error, try a different endpoint
        if (!error.response) {
          // Try to find a working endpoint
          await this.checkBackendHealth();
          
          // If we're still offline after the check, break out
          if (!backendStatusManager.getStatus().isBackendAvailable) {
            break;
          }
        } else if (error.response.status >= 500) {
          // Server error may require switching endpoints
          await this.checkBackendHealth();
        } else if (error.response.status >= 400 && error.response.status < 500) {
          // Client errors should not be retried or queued - it's a problem with the request
          break;
        }
        
        currentRetry++;
        
        // Add a short delay between retries
        if (currentRetry <= retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry));
        }
      }
    }
    
    // If we reach here, all retries failed
    
    // Add to pending requests queue if requested
    if (shouldQueue && navigator.onLine && endpoint) {
      this.queueRequest({ endpoint, method, data, options });
    }
    
    // Return fallback data if available
    if (useLocalFallback && localFallbackData) {
      return { ...localFallbackData, offline: true };
    }
    
    // If no fallback data, throw the last error
    throw lastError;
  }
  
  queueRequest({ endpoint, method, data, options = {} }) {
    const pendingRequest = {
      execute: () => {
        // Create a function that will execute this request when online
        switch (method.toUpperCase()) {
          case 'GET':
            return this.client.get(endpoint, data).then(res => res.data);
          case 'POST':
            return this.client.post(endpoint, data).then(res => res.data);
          case 'PUT':
            return this.client.put(endpoint, data).then(res => res.data);
          case 'DELETE':
            return this.client.delete(endpoint, { data }).then(res => res.data);
          default:
            return this.client.get(endpoint).then(res => res.data);
        }
      },
      timestamp: Date.now(),
      url: endpoint,
      method: method,
      data: data,
      options: options,
      onSuccess: options.onSuccess,
      onError: options.onError
    };
    
    backendStatusManager.addPendingRequest(pendingRequest);
    console.log(`Added ${method} request to ${endpoint} to pending queue`);
  }
  
  // Simplified request methods with automatic fallback
  async get(endpoint, params = {}, options = {}) {
    return this.executeWithFallback(
      () => this.client.get(endpoint, { params }).then(res => res.data),
      { ...options, endpoint, method: 'GET', data: params }
    );
  }
  
  async post(endpoint, data = {}, options = {}) {
    return this.executeWithFallback(
      () => this.client.post(endpoint, data).then(res => res.data),
      { ...options, endpoint, method: 'POST', data }
    );
  }
  
  async put(endpoint, data = {}, options = {}) {
    return this.executeWithFallback(
      () => this.client.put(endpoint, data).then(res => res.data),
      { ...options, endpoint, method: 'PUT', data }
    );
  }
  
  async delete(endpoint, data = {}, options = {}) {
    return this.executeWithFallback(
      () => this.client.delete(endpoint, { data }).then(res => res.data),
      { ...options, endpoint, method: 'DELETE', data }
    );
  }

  // Generate a recipe based on user preferences
  async generateRecipe(preferences) {
    return this.post('/recipes/generate', preferences, {
      useLocalFallback: true,
      localFallbackData: this.generateFallbackRecipe(preferences),
      retries: 2
    });
  }

  // Generate a fallback recipe for offline mode
  generateFallbackRecipe(preferences = {}) {
    // Default recipe that matches most dietary preferences
    const defaultRecipe = {
      name: "Balanced Veggie Bowl",
      description: "A versatile and nutritious meal that's easily customizable",
      ingredients: [
        "1 cup cooked quinoa or brown rice",
        "1 cup mixed vegetables (broccoli, carrots, bell peppers)",
        "1/2 cup beans or chickpeas",
        "1/4 avocado, sliced",
        "1 tbsp olive oil",
        "1 tbsp lemon juice",
        "Salt and pepper to taste",
        "Optional: herbs and spices of your choice"
      ],
      instructions: [
        "Cook quinoa or rice according to package instructions",
        "Steam or roast mixed vegetables until tender",
        "Combine all ingredients in a bowl",
        "Drizzle with olive oil and lemon juice",
        "Season with salt, pepper, and optional herbs/spices",
        "Mix well and enjoy"
      ],
      nutritionalInfo: {
        calories: "350-450",
        protein: "10-15g",
        carbs: "45-55g",
        fat: "15-20g",
        fiber: "8-12g"
      },
      category: "main",
      prepTime: "20 minutes",
      cookTime: "15 minutes",
      difficulty: "easy"
    };
    
    return defaultRecipe;
  }

  // Ask a health-related question
  async askHealthQuestion(question) {
    return this.executeWithFallback(
      () => this.client.post('/jarvis/ask', { question }).then(res => res.data),
      {
        useLocalFallback: true,
        localFallbackData: this.generateFallbackHealthAnswer(question),
        retries: 2
      }
    );
  }

  // Generate a fallback answer for health questions
  generateFallbackHealthAnswer(question = "") {
    const questionLower = question.toLowerCase();
    
    // Common questions with pre-defined answers
    if (questionLower.includes("protein") && questionLower.includes("need")) {
      return {
        answer: "The general recommendation for protein intake is 0.8g per kg of body weight daily for average adults. Athletes and those doing regular strength training may benefit from higher intake (1.2-2.0g per kg). Good protein sources include lean meats, fish, eggs, dairy, legumes, and plant-based options like tofu.",
        sources: ["American College of Sports Medicine guidelines"],
        offline: true
      };
    } else if (questionLower.includes("lose weight") || questionLower.includes("weight loss")) {
      return {
        answer: "Healthy weight loss comes from a combination of calorie deficit (consuming fewer calories than you burn), regular physical activity, and nutritious food choices. Aim for 1-2 pounds of weight loss per week, focus on whole foods, and stay consistent with your exercise routine.",
        sources: ["General nutrition guidelines"],
        offline: true
      };
    } else if (questionLower.includes("cardio") || questionLower.includes("cardiovascular")) {
      return {
        answer: "Generally, adults should aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity cardiovascular exercise weekly, spread across multiple days. Examples include brisk walking, running, cycling, swimming, or using cardio machines.",
        sources: ["American Heart Association recommendations"],
        offline: true
      };
    } else if (questionLower.includes("stretch") || questionLower.includes("flexibility")) {
      return {
        answer: "Stretching improves flexibility, range of motion, and may help prevent injuries. Consider stretching major muscle groups 2-3 times weekly, holding each stretch for 15-30 seconds. Dynamic stretches are best before workouts, while static stretches work well after exercise when muscles are warm.",
        sources: ["General fitness guidelines"],
        offline: true
      };
    } else {
      return {
        answer: "While offline, I can provide only general fitness and nutrition advice. For specific health questions, connect to the internet for a more detailed answer or consult with a healthcare professional.",
        sources: ["Offline mode - limited information available"],
        offline: true
      };
    }
  }

  // Get nutrition tips
  async getNutritionTips(category = "general") {
    return this.executeWithFallback(
      () => this.client.get(`/nutrition/tips?category=${category}`).then(res => res.data),
      {
        useLocalFallback: true,
        localFallbackData: this.generateFallbackNutritionTips(category),
        retries: 1
      }
    );
  }

  // Generate fallback nutrition tips
  generateFallbackNutritionTips(category = "general") {
    const generalTips = [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Aim to fill half your plate with vegetables at main meals",
      "Choose whole grains over refined grains when possible",
      "Include a source of protein with each meal to support muscle maintenance",
      "Limit added sugars and highly processed foods"
    ];
    
    const preworkoutTips = [
      "Consume a balanced meal 2-3 hours before exercise",
      "For a quick pre-workout snack, try a banana with a tablespoon of peanut butter",
      "Stay hydrated before your workout to maintain performance",
      "Complex carbs provide sustained energy for longer workouts",
      "Avoid very high-fat meals right before exercise as they may slow digestion"
    ];
    
    const postworkoutTips = [
      "Consume protein within 45 minutes after your workout to support muscle recovery",
      "Replenish glycogen stores with some carbohydrates post-workout",
      "Chocolate milk can be an effective recovery beverage with its protein-carb ratio",
      "Hydrate to replace fluids lost during exercise",
      "Include some anti-inflammatory foods like cherries or berries to help with recovery"
    ];
    
    switch(category.toLowerCase()) {
      case "preworkout":
        return { tips: preworkoutTips, category: "Pre-Workout Nutrition", offline: true };
      case "postworkout":
        return { tips: postworkoutTips, category: "Post-Workout Nutrition", offline: true };
      default:
        return { tips: generalTips, category: "General Nutrition", offline: true };
    }
  }
}

// Static methods for the BackendStatus component to use
FitViceApiService.getBackendStatus = function() {
  return backendStatusManager.getStatus();
};

FitViceApiService.getPendingRequestsCount = function() {
  return backendStatusManager.status.pendingRequests.length;
};

FitViceApiService.checkBackendAvailability = async function() {
  const service = new FitViceApiService();
  return service.checkBackendHealth();
};

FitViceApiService.processPendingRequests = function() {
  return backendStatusManager.processPendingRequests();
}; 