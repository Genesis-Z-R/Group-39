import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const logoGlowAnim = useRef(new Animated.Value(0)).current;
  
  // Particle positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    delay: Math.random() * 1000,
    size: Math.random() * 4 + 2,
  }));

  useEffect(() => {
    // Background fade in
    Animated.timing(backgroundAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Logo animations with staggered timing
    const logoAnimation = Animated.sequence([
      // Initial scale and fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo glow effect
      Animated.timing(logoGlowAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Particle animation
    const particleAnimation = Animated.timing(particleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    // Start animations
    logoAnimation.start();
    particleAnimation.start();

    // Auto-hide after 2.8 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const renderParticle = (particle: any) => {
    const opacity = particleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.6, 0.3],
    });

    const scale = particleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0.8],
    });

    return (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    );
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View style={[styles.container, { opacity: backgroundAnim }]}>
      {/* Animated background gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Glowing particles */}
      {particles.map(renderParticle)}
      
      {/* Main logo with glow effect */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />
        
        {/* Uploaded Logo Image */}
        <Image
          source={require('../../assets/bisa-logo.jpeg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Tagline with fade animation */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
            color: '#333333',
            textShadowColor: '#000000',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
          },
        ]}
      >
        Ask. Answer. Learn.
      </Animated.Text>
      
      {/* Subtle motion lines */}
      <Animated.View
        style={[
          styles.motionLine1,
          {
            opacity: particleAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.2, 0],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.motionLine2,
          {
            opacity: particleAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.15, 0],
            }),
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    // Add subtle gradient effect
    opacity: 0.95,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000000',
    top: -50,
    left: -50,
  },
  logoImage: {
    width: 120,
    height: 120,
    zIndex: 1,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 20,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FF69B4',
    borderRadius: 50,
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  motionLine1: {
    position: 'absolute',
    width: 2,
    height: 60,
    backgroundColor: '#FF69B4',
    borderRadius: 1,
    top: '30%',
    right: '20%',
    transform: [{ rotate: '45deg' }],
  },
  motionLine2: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: '#FF69B4',
    borderRadius: 1,
    bottom: '25%',
    left: '15%',
    transform: [{ rotate: '-30deg' }],
  },
}); 