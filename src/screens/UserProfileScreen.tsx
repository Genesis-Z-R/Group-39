import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import UserAvatar from '../components/UserAvatar';
import QuestionCard from '../components/QuestionCard';
import { User, Question } from '../types';

type UserProfileRouteProp = RouteProp<StackParamList, 'UserProfile'>;
type UserProfileNavigationProp = StackNavigationProp<StackParamList, 'UserProfile'>;

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  bio: 'Full-stack developer passionate about React Native and TypeScript. Building amazing mobile experiences and contributing to open source projects.',
  reputation: 1250,
  followers: 45,
  following: 23,
  isVerified: true,
  createdAt: new Date('2023-01-01'),
};

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement authentication in React Native?',
    content: 'I\'m building a React Native app and need to implement user authentication.',
    author: mockUser,
    tags: ['react-native', 'authentication', 'javascript'],
    answers: [],
    comments: [],
    upvotes: 15,
    downvotes: 2,
    views: 234,
    isAnswered: true,
    userVote: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Best practices for state management in React Native',
    content: 'What are the recommended patterns for managing state in large React Native applications?',
    author: mockUser,
    tags: ['react-native', 'state-management', 'redux'],
    answers: [],
    comments: [],
    upvotes: 8,
    downvotes: 1,
    views: 156,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

type TabType = 'questions' | 'answers' | 'activity';

export default function UserProfileScreen() {
  const route = useRoute<UserProfileRouteProp>();
  const navigation = useNavigation<UserProfileNavigationProp>();
  const { userId } = route.params;

  const [user] = useState<User>(mockUser);
  const [questions] = useState<Question[]>(mockQuestions);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('questions');

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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Here you would typically make an API call
  };

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail', { questionId });
  };

  const handleUserPress = (userId: string) => {
    // Navigate to another user's profile
    navigation.navigate('UserProfile', { userId });
  };

  const TabButton = ({ type, label, count }: { type: TabType; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.tabButtonActive]}
      onPress={() => setActiveTab(type)}
    >
      <Text style={[styles.tabButtonText, activeTab === type && styles.tabButtonTextActive]}>
        {label}
      </Text>
      <Text style={[styles.tabCount, activeTab === type && styles.tabCountActive]}>
        {count}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <UserAvatar
            size={80}
            username={user.username}
            avatar={user.avatar}
            isVerified={user.isVerified}
          />
          <View style={styles.userDetails}>
            <Text style={styles.username}>
              {user.username}
              {user.isVerified && (
                <Ionicons name="checkmark-circle" size={20} color="#1a73e8" />
              )}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.reputation}>
              {formatNumber(user.reputation)} reputation
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleFollow}
        >
          <Ionicons 
            name={isFollowing ? "checkmark" : "add"} 
            size={16} 
            color={isFollowing ? "#666" : "#ffffff"} 
          />
          <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bio */}
      {user.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.followers)}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.following)}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.reputation)}</Text>
          <Text style={styles.statLabel}>Reputation</Text>
        </View>
      </View>

      {/* Member since */}
      <View style={styles.memberSection}>
        <Text style={styles.memberText}>
          Member since {formatDate(user.createdAt)}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton type="questions" label="Questions" count={questions.length} />
        <TabButton type="answers" label="Answers" count={0} />
        <TabButton type="activity" label="Activity" count={0} />
      </View>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'questions':
        return (
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <QuestionCard
                question={item}
                onPress={handleQuestionPress}
                onUserPress={handleUserPress}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
          />
        );
      case 'answers':
        return (
          <FlatList
            data={[]}
            keyExtractor={() => 'empty'}
            renderItem={() => null}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No answers yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  When {user.username} answers questions, they'll appear here
                </Text>
              </View>
            }
          />
        );
      case 'activity':
        return (
          <FlatList
            data={[]}
            keyExtractor={() => 'empty'}
            renderItem={() => null}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No recent activity</Text>
                <Text style={styles.emptyStateSubtext}>
                  Recent activity will appear here
                </Text>
              </View>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reputation: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a73e8',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 4,
  },
  followingButtonText: {
    color: '#666',
  },
  bioSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsSection: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  memberSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  memberText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#1a73e8',
  },
  tabCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tabCountActive: {
    color: '#1a73e8',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 