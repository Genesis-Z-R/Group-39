// App configuration
export const config = {
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyAdE0DrlPCp1kLEbmwOo-xYe5k2WNAGph8",
    authDomain: "vesterapp-46245.firebaseapp.com",
    projectId: "vesterapp-46245",
    storageBucket: "vesterapp-46245.firebasestorage.app",
    messagingSenderId: "157448495564",
    appId: "1:157448495564:web:37f4e52418f1f9d71cbd69",
    measurementId: "G-ME6ZSFDF5Z"
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://bisa-backend-production.herokuapp.com/api',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: 'Bisa',
    version: '1.0.1',
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'production',
  },
  
  // Feature Flags
  features: {
    enableMockData: process.env.EXPO_PUBLIC_ENABLE_MOCK_DATA === 'true',
    enableDebugLogs: process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true',
    enableFactCheck: process.env.EXPO_PUBLIC_ENABLE_FACT_CHECK !== 'false',
    enableShareAnalytics: process.env.EXPO_PUBLIC_ENABLE_SHARE_ANALYTICS !== 'false',
  },
}; 