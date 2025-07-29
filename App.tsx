import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/utils/ThemeContext';
import { AuthProvider } from './src/utils/AuthContext';
import SplashScreen from './src/components/SplashScreen';
import { QuestionsProvider } from './src/utils/QuestionsContext';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QuestionsProvider>
            {showSplash ? (
              <SplashScreen onFinish={handleSplashFinish} />
            ) : (
              <>
                <AppNavigator />
                <StatusBar style="auto" />
              </>
            )}
          </QuestionsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
