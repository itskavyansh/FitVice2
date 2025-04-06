import { gapi } from 'gapi-script';

const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read'
];

class GoogleFitService {
  constructor() {
    this.isInitialized = false;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      await new Promise((resolve) => {
        gapi.load('client:auth2', resolve);
      });

      await gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        scope: GOOGLE_FIT_SCOPES.join(' '),
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest']
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Fit:', error);
      throw error;
    }
  }

  async signIn() {
    try {
      await this.init();
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      return authInstance.currentUser.get().getAuthResponse().access_token;
    } catch (error) {
      console.error('Error signing in to Google Fit:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    } catch (error) {
      console.error('Error signing out from Google Fit:', error);
      throw error;
    }
  }

  async getDailySteps(startTime, endTime) {
    try {
      const response = await gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: {
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      });
      return response.result.bucket;
    } catch (error) {
      console.error('Error fetching steps:', error);
      throw error;
    }
  }

  async getHeartRate(startTime, endTime) {
    try {
      const response = await gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: {
          aggregateBy: [{
            dataTypeName: 'com.google.heart_rate.bpm',
            dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
          }],
          bucketByTime: { durationMillis: 3600000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      });
      return response.result.bucket;
    } catch (error) {
      console.error('Error fetching heart rate:', error);
      throw error;
    }
  }

  async getSleepData(startTime, endTime) {
    try {
      const response = await gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: {
          aggregateBy: [{
            dataTypeName: 'com.google.sleep.segment',
            dataSourceId: 'derived:com.google.sleep.segment:com.google.android.gms:sleep_segment'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      });
      return response.result.bucket;
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      throw error;
    }
  }

  async getWeightData(startTime, endTime) {
    try {
      const response = await gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: {
          aggregateBy: [{
            dataTypeName: 'com.google.weight',
            dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      });
      return response.result.bucket;
    } catch (error) {
      console.error('Error fetching weight data:', error);
      throw error;
    }
  }
}

export default new GoogleFitService(); 