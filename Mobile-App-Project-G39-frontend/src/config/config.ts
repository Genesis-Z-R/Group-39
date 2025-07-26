// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000, // 10 seconds
  },
  
  // Firebase Configuration
  firebase: {
    // Add your Firebase config here if needed
  },
  
  // App Configuration
  app: {
    name: 'Bisa',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    enableMockData: process.env.EXPO_PUBLIC_ENABLE_MOCK_DATA === 'true',
    enableDebugLogs: process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true',
  },
}; 