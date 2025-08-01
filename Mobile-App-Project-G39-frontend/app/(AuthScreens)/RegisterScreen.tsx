import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../src/config/Firebase';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/context/authContext';
import { syncUserWithBackend } from '../../src/services/api';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword,setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const { setToken } = useAuth();

  // Handle registration
  const handleRegister = async () => {
  if (!email || !password || !username) {
    Alert.alert('Validation Error', 'All fields are required');
    return;
  }

  setLoading(true);
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with username
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    // Get Firebase ID token
    const token = await userCredential.user.getIdToken(true);
    setToken(token);
    
    // Sync user with backend
    console.log('🔄 Syncing new user with backend...');
    const backendUser = await syncUserWithBackend(token);
    console.log('✅ User synced with backend:', backendUser);

    Alert.alert('Success', 'Account created successfully');
    // navigation.navigate('Login');
  } catch (error: any) {
    console.error('Registration error:', error);
    Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <View style={[styles.passwordContainer, styles.inputFocused]}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              style={styles.passwordInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
            </TouchableOpacity>
          </View>

      

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => (navigation as any).navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#28a745',
    fontSize: 15,
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  inputFocused: {
    borderColor: '#007AFF',
  },
});

export default RegisterScreen;
