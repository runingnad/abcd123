// App Constants
export const APP_CONFIG = {
  NAME: 'MedCare',
  VERSION: '1.0.0',
  DESCRIPTION: 'Healthcare Inventory Management System',
};

// Demo Credentials
export const DEMO_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123',
};

// API Endpoints
export const API_ENDPOINTS = {
  TRIALS: '/trials',
  COLD_CHAIN: '/coldchain',
  INVENTORY: '/inventory',
  BLOCKCHAIN: '/blockchain',
  WEBSOCKET: '/ws',
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME_PREFERENCE: 'themePreference',
};

// Navigation Routes
export const ROUTES = {
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  DASHBOARD: 'Dashboard',
  CLINICAL_TRIALS: 'Clinical Trials',
  COLD_CHAIN: 'Cold Chain',
  AI_VERIFICATION: 'AI Verification',
  PATIENT_CARE: 'Patient Care',
  SETTINGS: 'Settings',
};

// Alert Types
export const ALERT_TYPES = {
  LOW_STOCK: 'low_stock',
  EXPIRY: 'expiry',
  COLD_CHAIN: 'cold_chain',
  SYSTEM: 'system',
};

// Alert Severities
export const ALERT_SEVERITIES = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
};

// Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  COLD_CHAIN: 3000, // 3 seconds
  NOTIFICATIONS: 60000, // 1 minute
};
