// 

import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/Firebase';
import { User } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from './context/themeContext'; // adjust if file is elsewhere

export default function RootLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
