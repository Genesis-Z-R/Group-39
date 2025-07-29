import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import UserAvatar from '../components/UserAvatar';
import Logo from '../components/Logo';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { User } from '../types';

type ProfileScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  bio: 'Full-stack developer passionate about React Native and TypeScript. Building amazing mobile experiences.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  reputation: 1250,
  followers: 45,
  following: 23,
  isVerified: true,
  createdAt: new Date('2023-01-01'),
};

export default function ProfileScreen({ route }: { route: any }) {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { signOut, user: authUser } = useAuth();
  const { theme } = useTheme();
  const [user, setUser] = useState<User>(authUser || mockUser);

  // Handle updated user data from EditProfile and auth context
  React.useEffect(() => {
    if (route.params?.updatedUser) {
      setUser(route.params.updatedUser);
    } else if (authUser) {
      setUser(authUser);
    }
  }, [route.params?.updatedUser, authUser]);

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile', { user }),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About BISA',
      onPress: () => navigation.navigate('AboutBisa'),
    },
    {
      icon: 'log-out-outline',
      title: 'Sign Out',
      onPress: () => {
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign Out', 
              style: 'destructive',
              onPress: () => {
                signOut();
                // Navigation will be handled by AuthGuard automatically
              }
            }
          ]
        );
      },
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Logo size="small" showText={false} />
          </View>
          <View style={styles.profileInfo}>
            <UserAvatar
              size={80}
              username={user.name}
              avatar={user.profileImage}
              isVerified={user.isVerified}
            />
            <View style={styles.userDetails}>
              <Text style={[styles.username, { color: theme.colors.text }]}>
                {user.name}
                {user.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                )}
              </Text>
              <Text style={[styles.handle, { color: theme.colors.textSecondary }]}>@{user.username}</Text>
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user.email}</Text>
              <Text style={[styles.reputation, { color: theme.colors.textSecondary }]}>
                {formatNumber(user.reputation)} reputation
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        {(user.bio || user.location || user.website) && (
          <View style={[styles.bioSection, { backgroundColor: theme.colors.surface }]}>
            {user.bio && <Text style={[styles.bio, { color: theme.colors.text }]}>{user.bio}</Text>}
            {user.location && (
              <View style={styles.bioItem}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>{user.location}</Text>
              </View>
            )}
            {user.website && (
              <View style={styles.bioItem}>
                <Ionicons name="globe-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>{user.website}</Text>
              </View>
            )}
          </View>
        )}

        {/* Stats */}
        <View style={[styles.statsSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{formatNumber(user.followers)}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{formatNumber(user.following)}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{formatNumber(user.reputation)}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Reputation</Text>
          </View>
        </View>

        {/* Member since */}
        <View style={[styles.memberSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.memberText, { color: theme.colors.textSecondary }]}>
            Member since {formatDate(user.createdAt)}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: theme.colors.surface }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={theme.colors.textSecondary} />
                <Text style={[styles.menuItemTitle, { color: theme.colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout button removed */}
        {/* <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#f44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  handle: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  reputation: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  bioSection: {
    padding: 20,
    borderTopWidth: 1,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  bioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    marginLeft: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
  },
  memberSection: {
    padding: 20,
    borderTopWidth: 1,
  },
  memberText: {
    fontSize: 14,
    textAlign: 'center',
  },
  menuSection: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 16,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
    marginLeft: 8,
  },
}); 