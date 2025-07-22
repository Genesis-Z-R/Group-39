import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/bisa-logo.png')} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        A place to share knowledge and better understand the world
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => navigation.navigate('LoginFormScreen')}
      >
        <Text style={styles.actionText}>Login</Text>
      </TouchableOpacity>

      {/* Sign up */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.actionText}>Sign up with Email</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.divider}>OR</Text>

      
      {/* Google Button */}
      <TouchableOpacity style={styles.googleBtn}>
        <AntDesign name="google" size={20} color="white" />
        <Text style={styles.btnText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook Button */}
      <TouchableOpacity style={styles.facebookBtn}>
        <FontAwesome name="facebook" size={20} color="white" />
        <Text style={styles.btnText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
    paddingHorizontal: 6,
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#db4437',
    width: '100%',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  facebookBtn: {
    flexDirection: 'row',
    backgroundColor: '#1877f2',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 20,
    fontSize: 15,
    color: '#555',
  },
  actionBtn: {
    backgroundColor: '#eee',
    width: '100%',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 8,
  },
});
