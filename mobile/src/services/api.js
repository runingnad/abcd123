import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  const ws = new WebSocket(`ws://localhost:8000/ws`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
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
