import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useTheme } from '../utils/ThemeContext';
import { FirebaseAuthService } from '../services/firebaseAuth';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<StackParamList, 'SignIn'>;

interface ResetMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const resetMethods: ResetMethod[] = [
  {
    id: 'email',
    title: 'Email Reset',
    description: 'Receive a password reset link via email',
    icon: 'mail-outline',
    color: '#007AFF'
  },
  {
    id: 'sms',
    title: 'SMS Reset',
    description: 'Receive a verification code via SMS',
    icon: 'phone-portrait-outline',
    color: '#34C759'
  },
  {
    id: 'security-questions',
    title: 'Security Questions',
    description: 'Answer your security questions to reset',
    icon: 'shield-checkmark-outline',
    color: '#FF9500'
  }
];

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'method' | 'verify' | 'reset'>('method');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleMethodSelection = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSendReset = async () => {
    if (selectedMethod === 'email') {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    } else if (selectedMethod === 'sms') {
      if (!phone.trim()) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }
      if (!validatePhone(phone)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (selectedMethod === 'email') {
        // Use Firebase Auth for email password reset
        await FirebaseAuthService.resetPassword(email.trim());
        
        Alert.alert(
          'Reset Link Sent',
          'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsSubmitted(true);
                setStep('verify');
              }
            }
          ]
        );
      } else if (selectedMethod === 'sms') {
        // For SMS, we'll simulate since Firebase doesn't support SMS password reset directly
        // In a real app, you'd integrate with a service like Twilio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        Alert.alert(
          'Verification Code Sent',
          'We\'ve sent a 6-digit verification code to your phone number. Please enter it below.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsSubmitted(true);
                setStep('verify');
              }
            }
          ]
        );
      } else {
        // Security questions - proceed to verification
        setStep('verify');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (verificationCode.length < 4) {
      Alert.alert('Error', 'Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('reset');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully reset. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('SignIn')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Choose Reset Method
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Select how you'd like to reset your password
      </Text>

      <View style={styles.methodsContainer}>
        {resetMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: selectedMethod === method.id ? method.color : theme.colors.border,
                borderWidth: selectedMethod === method.id ? 2 : 1,
              }
            ]}
            onPress={() => handleMethodSelection(method.id)}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
              <Ionicons name={method.icon as any} size={24} color="#ffffff" />
            </View>
            <View style={styles.methodContent}>
              <Text style={[styles.methodTitle, { color: theme.colors.text }]}>
                {method.title}
              </Text>
              <Text style={[styles.methodDescription, { color: theme.colors.textSecondary }]}>
                {method.description}
              </Text>
            </View>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={method.color} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedMethod === 'email' && (
        <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Enter your email address"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      )}

      {selectedMethod === 'sms' && (
        <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
          <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
          isLoading && styles.buttonDisabled
        ]}
        onPress={handleSendReset}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Send Reset Instructions</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderVerification = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Verify Your Identity
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        {selectedMethod === 'email' 
          ? 'We\'ve sent a verification code to your email address.'
          : selectedMethod === 'sms'
          ? 'We\'ve sent a 6-digit code to your phone number.'
          : 'Please answer your security questions to verify your identity.'
        }
      </Text>

      {selectedMethod !== 'security-questions' && (
        <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
          <Ionicons name="key-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Enter verification code"
            placeholderTextColor={theme.colors.textSecondary}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
          isLoading && styles.buttonDisabled
        ]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setStep('method')}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
          Back to Reset Methods
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordReset = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Create New Password
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Enter your new password below
      </Text>

      <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="New password"
          placeholderTextColor={theme.colors.textSecondary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showNewPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Confirm new password"
          placeholderTextColor={theme.colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.passwordRequirements, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.requirementsTitle, { color: theme.colors.text }]}>
          Password Requirements:
        </Text>
        <Text style={[styles.requirement, { color: newPassword.length >= 8 ? '#34C759' : theme.colors.textSecondary }]}>
          • At least 8 characters long
        </Text>
        <Text style={[styles.requirement, { color: /[A-Z]/.test(newPassword) ? '#34C759' : theme.colors.textSecondary }]}>
          • Contains uppercase letter
        </Text>
        <Text style={[styles.requirement, { color: /[a-z]/.test(newPassword) ? '#34C759' : theme.colors.textSecondary }]}>
          • Contains lowercase letter
        </Text>
        <Text style={[styles.requirement, { color: /\d/.test(newPassword) ? '#34C759' : theme.colors.textSecondary }]}>
          • Contains number
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
          isLoading && styles.buttonDisabled
        ]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Forgot Password</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressSteps}>
            <View style={[
              styles.progressStep,
              { backgroundColor: step === 'method' ? theme.colors.primary : theme.colors.border }
            ]}>
              <Text style={[styles.progressText, { color: step === 'method' ? '#ffffff' : theme.colors.textSecondary }]}>
                1
              </Text>
            </View>
            <View style={[styles.progressLine, { backgroundColor: step === 'method' ? theme.colors.border : theme.colors.primary }]} />
            <View style={[
              styles.progressStep,
              { backgroundColor: step === 'verify' ? theme.colors.primary : theme.colors.border }
            ]}>
              <Text style={[styles.progressText, { color: step === 'verify' ? '#ffffff' : theme.colors.textSecondary }]}>
                2
              </Text>
            </View>
            <View style={[styles.progressLine, { backgroundColor: step === 'reset' ? theme.colors.primary : theme.colors.border }]} />
            <View style={[
              styles.progressStep,
              { backgroundColor: step === 'reset' ? theme.colors.primary : theme.colors.border }
            ]}>
              <Text style={[styles.progressText, { color: step === 'reset' ? '#ffffff' : theme.colors.textSecondary }]}>
                3
              </Text>
            </View>
          </View>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            {step === 'method' ? 'Choose Method' : step === 'verify' ? 'Verify Identity' : 'Reset Password'}
          </Text>
        </View>

        {/* Step Content */}
        {step === 'method' && renderMethodSelection()}
        {step === 'verify' && renderVerification()}
        {step === 'reset' && renderPasswordReset()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  passwordRequirements: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 4,
  },
}); 