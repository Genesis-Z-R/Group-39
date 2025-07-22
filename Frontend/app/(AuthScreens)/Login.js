import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../config/Firebase'; // Ensure this is correct
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', response.user.uid);
      router.push('../(drawer)/Home/Index'); // go to main app
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created:', response.user.uid);
      router.replace('../(drawer)/(tabs)/Home/Index.tsx');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Bisa</Text>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email..."
            value={email}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={setEmail}
            style={styles.inputText}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={[styles.passwordContainer, isFocused && styles.inputFocused]}>
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

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonTextLight}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => router.push('./../(AuthScreens)/PasswordReset')}
              disabled={loading}>
              <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => router.push('./../(AuthScreens)/RegisterScreen')}
              disabled={loading}>
              <Text style={styles.buttonTextOutline}>Create an account</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainerLogo}>
              <TouchableOpacity
                style={styles.buttonLogo}
                onPress={() => Alert.alert('Feature coming soon!')}
                disabled={loading}>
                <Image source={require('../../assets/_Google.jpeg')} style={styles.icon} />
                <Text style={styles.buttonTextLight}>Login with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonLogo, styles.buttonOutline]}
                onPress={() => Alert.alert('Feature coming soon!')}
                disabled={loading}>
                <Image source={require('../../assets/facebook.jpeg')} style={styles.icon} />
                <Text style={styles.buttonTextOutline}>Login with Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdde1',
    paddingHorizontal: 20,
    paddingTop: 5,
    marginBottom: 60,
    marginTop: StatusBar.currentHeight || 20,
  },
  header: {
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    marginBottom: 30,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f5f6fa',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputText: {
    width: '90%',
    marginVertical: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonContainerLogo: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonLogo: {
    flexDirection: 'row',
    backgroundColor: '#ff4757',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '100%',
  },
  buttonOutline: {
    backgroundColor: '#f1f2f6',
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  buttonTextLight: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputFocused: {
    borderColor: '#3498db', // blue highlight
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // for Android shadow
  },
  icon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    marginRight: 6,
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
});
