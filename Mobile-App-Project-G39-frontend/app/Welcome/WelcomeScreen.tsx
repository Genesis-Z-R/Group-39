import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.logo}>💡 IdeaHub</Text>
      <Text style={styles.tagline}>"Where Ideas Meet Community"</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/carousel')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)')}>
        <Text style={styles.secondaryButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)')}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3a0ca3' },
  logo: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  tagline: { color: '#fff', marginVertical: 20, fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#7209b7', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
  secondaryButton: { marginTop: 10 },
  secondaryButtonText: { color: '#fff', textDecorationLine: 'underline' },
  guestText: { marginTop: 10, color: '#cdb4db', fontSize: 14 }
});
