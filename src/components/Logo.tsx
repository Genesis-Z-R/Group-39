import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  const { theme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 48;
      default: return 36;
    }
  };

  const logoSize = getSize();
  const fontSize = logoSize * 0.4;

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize }]}>
        {/* Pink arc - main decorative element */}
        <View style={[styles.pinkArc, { borderColor: '#FF69B4' }]} />
        
        {/* Main B letter - stylized and fluid */}
        <View style={[styles.letterB, { borderColor: theme.colors.text }]}>
          {/* B curves */}
          <View style={[styles.bCurve1, { borderColor: theme.colors.text }]} />
          <View style={[styles.bCurve2, { borderColor: theme.colors.text }]} />
          <View style={[styles.bCurve3, { borderColor: theme.colors.text }]} />
        </View>
        
        {/* Question mark curve extending from B */}
        <View style={[styles.questionCurve, { borderColor: theme.colors.text }]} />
        
        {/* Pink dot */}
        <View style={[styles.pinkDot, { backgroundColor: '#FF69B4' }]} />
      </View>
      
      {showText && (
        <Text style={[styles.logoText, { color: theme.colors.text, fontSize }]}>
          BISA
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinkArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  letterB: {
    position: 'absolute',
    width: '70%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bCurve1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRadius: 8,
  },
  bCurve2: {
    position: 'absolute',
    top: '20%',
    left: '60%',
    width: '40%',
    height: '25%',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bCurve3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
    width: '40%',
    height: '25%',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  questionCurve: {
    position: 'absolute',
    bottom: '10%',
    left: '65%',
    width: '30%',
    height: '30%',
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 50,
    transform: [{ rotate: '-90deg' }],
  },
  pinkDot: {
    position: 'absolute',
    bottom: '15%',
    left: '20%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 