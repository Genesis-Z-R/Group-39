import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import handleLogout from '../../../src/utils/authHelp';

export default function ProfileScreen() {
  const router = useRouter();

  const handleChangePassword = () => {
    // 🔗 Integrate your Spring Boot change password API here
      router.push('/(AuthScreens)/ChangePassword')
  };

  const handleFollowers = () => {
    // 🔗 Navigate or call backend API to fetch followers
    alert('Followers screen');
  };

  const handleFollowing = () => {
    // 🔗 Navigate or call backend API to fetch following list
    alert('Following screen');
  };

  const handlePosts = () => {
    // 🔗 Navigate or fetch posts by user
    alert('User posts');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      {/* -------- User Avatar -------- */}
      <Image
        source={{ uri: 'https://your-avatar-url.com/avatar.jpg' }}
        style={styles.avatar}
      />

      {/* -------- Username -------- */}
      <Text style={styles.username}>John Doe</Text>

      {/* -------- Bio or About -------- */}
      <Text style={styles.bio}>
        Full Stack Developer | React Native Enthusiast | Tech Blogger
      </Text>

      {/* -------- User Stats (Posts, Followers, Following) -------- */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem} onPress={handlePosts}>
          <Text style={styles.statNumber}>120</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={handleFollowers}>
          <Text style={styles.statNumber}>5.2k</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={handleFollowing}>
          <Text style={styles.statNumber}>300</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* -------- Buttons -------- */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/modals/EditProfile')}
        >
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChangePassword}
        >
          <Ionicons name="key-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight || 50,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginVertical: 8,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
});
