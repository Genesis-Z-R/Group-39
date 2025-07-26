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
  Platform,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../src/config/Firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider
} from 'firebase/auth';
import { useAuth } from '../../src/context/authContext';
import * as Google from 'expo-auth-session/providers/google';
import { syncUserWithBackend } from '../../src/services/api';

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true, message: '' };
};

// Error message mapping for better UX
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups for this site';
    default:
      return 'An error occurred. Please try again';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSignUp, setIsSignUp] = useState(false);
  
  const router = useRouter();
  const { setToken } = useAuth();

  // Google AuthSession setup
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '967634611386-k81tvmi0oj8f0sgt5s8b4urbq7jnja3d.apps.googleusercontent.com',
  });

  // Function to sync user with backend
  const syncUserToBackend = async (token: string) => {
    try {
      console.log('🔄 Syncing user with backend...');
      const backendUser = await syncUserWithBackend(token);
      console.log('✅ User synced with backend:', backendUser);
    } catch (error) {
      console.error('❌ Failed to sync user with backend:', error);
      // Don't throw error - this shouldn't break the auth flow
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      const result = await googlePromptAsync();
      if (result?.type === 'success' && result.authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(result.authentication.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const token = await userCredential.user.getIdToken(true);
        setToken(token);
        
        // Sync user with backend
        await syncUserToBackend(token);
        
        router.replace('/(drawer)/(tabs)/Home');
      } else if (result?.type === 'error') {
        Alert.alert('Google Sign-In Failed', 'Authentication error.');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }, [googlePromptAsync, router, setToken]);

  // Facebook handler: feature coming soon
  const handleFacebookSignIn = useCallback(() => {
    Alert.alert('Feature coming soon!', 'Facebook login will be available in a future update.');
  }, []);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (isSignUp) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email/password authentication
  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let userCredential;
      
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        console.log('✅ User created:', userCredential.user.uid);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        console.log('✅ Login successful:', userCredential.user.uid);
      }

      // Get the ID token for backend authentication
      const token = await userCredential.user.getIdToken(true);
      setToken(token);
      
      // Sync user with backend
      await syncUserToBackend(token);
      
      router.replace('../(drawer)/(tabs)/Home/Index');
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      Alert.alert(
        isSignUp ? 'Registration Failed' : 'Login Failed',
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear errors when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Bisa</Text>
          <Text style={styles.subtitleText}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.inputContainer}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email address"
              value={email}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={handleEmailChange}
              style={[
                styles.inputText,
                errors.email && styles.inputError,
                isFocused && styles.inputFocused
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address"
            />
            {errors.email && (
              <Text style={styles.errorText} accessibilityRole="alert">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={[
              styles.passwordContainer,
              errors.password && styles.inputError,
              isFocused && styles.inputFocused
            ]}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={isSignUp ? "new-password" : "password"}
                textContentType={isSignUp ? "newPassword" : "password"}
                accessibilityLabel="Password input field"
                accessibilityHint="Enter your password"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                accessibilityRole="button"
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText} accessibilityRole="alert">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Password requirements for sign up */}
          {isSignUp && password.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password requirements:</Text>
              <Text style={[
                styles.requirement,
                password.length >= 6 && styles.requirementMet
              ]}>
                • At least 6 characters
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*[a-z])/.test(password) && styles.requirementMet
              ]}>
                • One lowercase letter
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*[A-Z])/.test(password) && styles.requirementMet
              ]}>
                • One uppercase letter
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*\d)/.test(password) && styles.requirementMet
              ]}>
                • One number
              </Text>
            </View>
          )}

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.button, 
                (!email.trim() || !password.trim() || loading) && styles.buttonDisabled
              ]} 
              onPress={handleAuth} 
              disabled={loading || !email.trim() || !password.trim()}
              accessibilityLabel={isSignUp ? "Create account" : "Sign in"}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonTextLight}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle between sign in and sign up */}
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              disabled={loading}
              accessibilityLabel={isSignUp ? "Switch to sign in" : "Switch to create account"}
              accessibilityRole="button"
            >
              <Text style={styles.buttonTextOutline}>
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password - only show on sign in */}
            {!isSignUp && (
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => router.push('./../(AuthScreens)/PasswordReset')}
                disabled={loading}
                accessibilityLabel="Forgot password"
                accessibilityRole="button"
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <Text style={styles.socialDivider}>or continue with</Text>
              
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleSignIn}
                  disabled={loading || !googleRequest}
                  accessibilityLabel="Sign in with Google"
                  accessibilityRole="button"
                >
                  <Image source={require('../../assets/_Google.jpeg')} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={handleFacebookSignIn}
                  disabled={true}
                  accessibilityLabel="Sign in with Facebook"
                  accessibilityRole="button"
                >
                  <Image source={require('../../assets/facebook.jpeg')} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#dcdde1',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdde1',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    marginBottom: 30,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f5f6fa',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#f5f6fa',
    opacity: 0.9,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  inputText: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  inputFocused: {
    borderColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  requirementsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  requirement: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 2,
  },
  requirementMet: {
    color: '#28a745',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
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
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  socialDivider: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    backgroundColor: '#fff',
    minHeight: 48,
  },
  googleButton: {
    backgroundColor: '#fff',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  socialIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
