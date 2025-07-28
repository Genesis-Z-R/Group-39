import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserAvatarProps {
  size?: number;
  username: string;
  avatar?: string;
  isVerified?: boolean;
}

export default function UserAvatar({ 
  size = 40, 
  username, 
  avatar, 
  isVerified = false 
}: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (avatar) {
    console.log('Rendering avatar with URI:', avatar);
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Image 
          source={{ uri: avatar }} 
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
          onError={() => console.log('Failed to load avatar image:', avatar)}
          onLoad={() => console.log('Avatar image loaded successfully:', avatar)}
        />
        {isVerified && (
          <View style={[styles.verifiedBadge, { right: size * 0.1, bottom: size * 0.1 }]}>
            <Ionicons name="checkmark-circle" size={size * 0.3} color="#1a73e8" />
          </View>
        )}
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          backgroundColor: getRandomColor(username) 
        }
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
        {getInitials(username)}
      </Text>
      {isVerified && (
        <View style={[styles.verifiedBadge, { right: size * 0.1, bottom: size * 0.1 }]}>
          <Ionicons name="checkmark-circle" size={size * 0.3} color="#1a73e8" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  avatarImage: {
    borderRadius: 20,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
}); 