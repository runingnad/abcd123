import axios from 'axios';
import { Platform } from 'react-native';

// Dynamic API URL based on platform
const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return __DEV__ ? 'http://10.0.2.2:8000' : 'https://your-production-api.com';
  } else if (Platform.OS === 'ios') {
    return __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com';
  } else {
    return __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com';
  }
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// Clinical Trials API
export const clinicalTrialsAPI = {
  getAllTrials: () => api.get('/trials'),
  createTrial: (trialData) => api.post('/trials', trialData),
  approveTrial: (batchID, approverData) => api.post(`/trials/${batchID}/approve`, approverData),
  getTrialByID: (batchID) => api.get(`/trials/${batchID}`),
};

// Cold Chain API
export const coldChainAPI = {
  getColdChainData: () => api.get('/coldchain'),
  getColdChainDataByBatch: (batchID) => api.get(`/coldchain/${batchID}`),
  predictRisk: (batchData) => api.post('/coldchain/predict', batchData),
  testModel: () => api.get('/coldchain/test'),
};

// Inventory API
export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  getInventoryStats: () => api.get('/inventory/stats'),
  addInventoryItem: (itemData) => api.post('/inventory', itemData),
  updateInventoryItem: (itemID, itemData) => api.put(`/inventory/${itemID}`, itemData),
  deleteInventoryItem: (itemID) => api.delete(`/inventory/${itemID}`),
};

// Blockchain API
export const blockchainAPI = {
  getBlockchainActivity: () => api.get('/blockchain'),
  getTransactionHistory: () => api.get('/blockchain/history'),
};

// WebSocket connection for real-time updates
export const createWebSocketConnection = (onMessage) => {
  const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws';
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return ws;
};

export default api;
