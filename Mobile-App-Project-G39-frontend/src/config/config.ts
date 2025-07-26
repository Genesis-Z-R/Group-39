// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000, // 10 seconds
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAdE0DrlPCp1kLEbmwOo-xYe5k2WNAGph8',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'vesterapp-46245.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'vesterapp-46245',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'vesterapp-46245.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '157448495564',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:157448495564:web:37f4e52418f1f9d71cbd69',
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ME6ZSFDF5Z',
  },
  
  // App Configuration
  app: {
    name: 'Bisa',
    version: '1.0.0',
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  },
  
  // Feature Flags
  features: {
    enableMockData: process.env.EXPO_PUBLIC_ENABLE_MOCK_DATA === 'true',
    enableDebugLogs: process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true',
    enableFactCheck: process.env.EXPO_PUBLIC_ENABLE_FACT_CHECK !== 'false',
    enableShareAnalytics: process.env.EXPO_PUBLIC_ENABLE_SHARE_ANALYTICS !== 'false',
  },
}; 