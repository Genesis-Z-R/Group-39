import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../src/context/authContext';
import { fetchUserProfile, followUser, unfollowUserProfile, followUserProfile, fetchUserPosts } from '../src/services/api';

// Types
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  credentials?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

interface UserPost {
  id: string;
  question: string;
  answer: string;
  upvotes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

// Mock data for different users
const mockUserProfiles: Record<string, UserProfile> = {
  'user1': {
    id: 'user1',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    credentials: 'PhD in Computer Science, Former Google Engineer',
    bio: 'Passionate about technology and education. Helping developers build better software through knowledge sharing and mentorship.',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnson.dev',
    joinDate: '2023-01-15T00:00:00Z',
    followersCount: 1247,
    followingCount: 89,
    postsCount: 45,
    isFollowing: false,
    isCurrentUser: false
  },
  'user2': {
    id: 'user2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    credentials: 'Senior Software Engineer at Microsoft',
    bio: 'Full-stack developer with 8+ years of experience. Love building scalable applications and mentoring junior developers.',
    location: 'Seattle, WA',
    website: 'https://michaelchen.dev',
    joinDate: '2023-03-20T00:00:00Z',
    followersCount: 892,
    followingCount: 156,
    postsCount: 32,
    isFollowing: true,
    isCurrentUser: false
  },
  'user3': {
    id: 'user3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    credentials: 'UX Designer at Apple',
    bio: 'Creating beautiful and intuitive user experiences. Passionate about design systems and user research.',
    location: 'Cupertino, CA',
    website: 'https://emmarodriguez.design',
    joinDate: '2023-02-10T00:00:00Z',
    followersCount: 2156,
    followingCount: 234,
    postsCount: 67,
    isFollowing: false,
    isCurrentUser: false
  },
  'user4': {
    id: 'user4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    credentials: 'Entrepreneur, Founded 3 startups',
    bio: 'Serial entrepreneur passionate about building products that solve real problems. Always learning and sharing insights.',
    location: 'New York, NY',
    website: 'https://davidkim.co',
    joinDate: '2022-11-05T00:00:00Z',
    followersCount: 3421,
    followingCount: 445,
    postsCount: 89,
    isFollowing: false,
    isCurrentUser: false
  },
  'user5': {
    id: 'user5',
    name: 'Lisa Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    credentials: 'Data Scientist at Netflix',
    bio: 'Data scientist working on recommendation systems. Love exploring data and building ML models.',
    location: 'Los Angeles, CA',
    website: 'https://lisathompson.ai',
    joinDate: '2023-04-12T00:00:00Z',
    followersCount: 1678,
    followingCount: 123,
    postsCount: 54,
    isFollowing: true,
    isCurrentUser: false
  }
};

// Mock posts for different users
const mockUserPosts: Record<string, UserPost[]> = {
  'user1': [
    {
      id: '1',
      question: 'What are the most important programming concepts every developer should master?',
      answer: 'After 15 years in the industry, I believe these are the fundamental concepts: 1) Data structures and algorithms - Understanding how to efficiently store and manipulate data. 2) Object-oriented programming principles - Encapsulation, inheritance, and polymorphism. 3) Database design and SQL - Most applications need to store data. 4) Version control with Git - Essential for collaboration. 5) Testing - Writing maintainable code requires good testing practices.',
      upvotes: 234,
      comments: 45,
      shares: 12,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      question: 'How do you approach learning a new programming language?',
      answer: 'My approach to learning new languages: Start with the fundamentals - syntax, data types, control structures. Build small projects - nothing teaches like hands-on experience. Read existing code - understand how others solve problems. Practice regularly - consistency beats intensity. Join communities - learn from others and share knowledge.',
      upvotes: 156,
      comments: 23,
      shares: 8,
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      question: 'What\'s your advice for junior developers starting their career?',
      answer: 'Focus on fundamentals over frameworks. Learn to write clean, readable code. Ask questions and don\'t be afraid to say "I don\'t know." Build a portfolio of projects. Network with other developers. Stay curious and keep learning. Remember that everyone was a junior developer once.',
      upvotes: 189,
      comments: 34,
      shares: 15,
      createdAt: '2024-01-05T09:15:00Z'
    }
  ],
  'user2': [
    {
      id: '4',
      question: 'How do you stay motivated while learning to code?',
      answer: 'Learning to code can be challenging, but here are strategies that worked for me: Build projects you care about - passion projects keep you engaged. Join coding communities - surrounding yourself with other learners creates accountability. Celebrate small wins - every bug fixed is progress. Take breaks - burnout is real, rest is important. Remember why you started - keep your end goal in mind.',
      upvotes: 189,
      comments: 67,
      shares: 23,
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '5',
      question: 'What\'s your favorite debugging technique?',
      answer: 'My go-to debugging approach: 1) Rubber duck debugging - explain the problem to someone (or something) else. 2) Add strategic console.logs or breakpoints. 3) Check the data flow step by step. 4) Use browser dev tools for frontend issues. 5) Read error messages carefully - they often contain the solution.',
      upvotes: 145,
      comments: 28,
      shares: 9,
      createdAt: '2024-01-12T11:30:00Z'
    }
  ],
  'user3': [
    {
      id: '6',
      question: 'What makes a good user interface design?',
      answer: 'Great UI design is invisible to users. Here are key principles: Consistency - use familiar patterns and maintain visual hierarchy. Simplicity - remove unnecessary elements that don\'t serve a purpose. Accessibility - design for users with different abilities. Feedback - provide clear responses to user interactions. Performance - fast loading and smooth animations are crucial for good UX.',
      upvotes: 156,
      comments: 34,
      shares: 9,
      createdAt: '2024-01-13T09:20:00Z'
    },
    {
      id: '7',
      question: 'How do you approach user research?',
      answer: 'User research is the foundation of good design. Start with clear objectives - what do you want to learn? Use multiple methods - interviews, surveys, usability testing, analytics. Listen more than you talk - let users share their experiences. Look for patterns - identify common pain points and needs. Share findings widely - make sure the whole team understands user needs.',
      upvotes: 98,
      comments: 15,
      shares: 6,
      createdAt: '2024-01-11T16:45:00Z'
    }
  ],
  'user4': [
    {
      id: '8',
      question: 'What\'s the biggest mistake first-time entrepreneurs make?',
      answer: 'The biggest mistake is building something nobody wants. Many entrepreneurs fall in love with their idea without validating it with real customers. Before writing a single line of code or investing significant time, talk to potential customers. Understand their pain points. Build a minimum viable product (MVP) and get feedback early and often. Pivot when necessary - being attached to a bad idea will sink your startup.',
      upvotes: 445,
      comments: 89,
      shares: 34,
      createdAt: '2024-01-12T14:10:00Z'
    },
    {
      id: '9',
      question: 'How do you validate a business idea?',
      answer: 'Validation is crucial before investing heavily. Start with customer interviews - talk to potential users about their problems. Create a landing page - see if people are interested enough to sign up. Build a simple prototype - get early feedback on your solution. Run small experiments - test assumptions with minimal investment. Look for patterns - if multiple people have the same problem, you might have a market.',
      upvotes: 234,
      comments: 45,
      shares: 18,
      createdAt: '2024-01-10T10:20:00Z'
    }
  ],
  'user5': [
    {
      id: '10',
      question: 'How is machine learning changing the entertainment industry?',
      answer: 'ML is revolutionizing entertainment in several ways: Personalized recommendations - algorithms analyze viewing patterns to suggest content you\'ll love. Content creation - AI helps in scriptwriting, music composition, and even generating visual effects. Audience insights - ML helps studios understand what content resonates with different demographics. Production optimization - from scheduling to budget allocation, ML improves efficiency across the pipeline.',
      upvotes: 267,
      comments: 52,
      shares: 15,
      createdAt: '2024-01-11T11:25:00Z'
    },
    {
      id: '11',
      question: 'What\'s your approach to feature engineering?',
      answer: 'Feature engineering is both art and science. Start with domain knowledge - understand what variables matter for your problem. Explore the data - use visualization and statistics to understand relationships. Create meaningful features - transform raw data into useful representations. Validate features - test their predictive power. Iterate and refine - feature engineering is an iterative process.',
      upvotes: 123,
      comments: 19,
      shares: 7,
      createdAt: '2024-01-09T14:30:00Z'
    }
  ]
};

const UserProfile: React.FC = () => {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use real API call when backend is available
        if (token) {
          console.log('UserProfile: Attempting to fetch profile from backend...');
          const profileData = await fetchUserProfile(userId as string, token);
          console.log('UserProfile: Backend response:', profileData);
          
          setProfile(profileData);
          
          // Load user posts
          const postsData = await fetchUserPosts(userId as string, 0, 10, token);
          setPosts(postsData.content || []);
        } else {
          // Fallback to mock data when no token
          console.log('UserProfile: No token available, using mock data');
          const mockProfile = mockUserProfiles[userId as string];
          const mockPostsData = mockUserPosts[userId as string];
          
          if (mockProfile) {
            setProfile(mockProfile);
            setPosts(mockPostsData || []);
          } else {
            // Fallback profile for unknown users
            setProfile({
              id: userId as string,
              name: 'Unknown User',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
              credentials: 'User',
              bio: 'This user profile is not available.',
              location: 'Unknown',
              website: '',
              joinDate: new Date().toISOString(),
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
              isFollowing: false,
              isCurrentUser: false
            });
            setPosts([]);
          }
        }
        
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setError('Failed to load user profile. Please try again.');
        // Fallback to mock data on error
        const mockProfile = mockUserProfiles[userId as string];
        const mockPostsData = mockUserPosts[userId as string];
        
        if (mockProfile) {
          setProfile(mockProfile);
          setPosts(mockPostsData || []);
        } else {
          // Fallback to default profile
          setProfile({
            id: userId as string,
            name: 'Error Loading Profile',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
            credentials: 'User',
            bio: 'Unable to load profile information.',
            location: 'Unknown',
            website: '',
            joinDate: new Date().toISOString(),
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            isFollowing: false,
            isCurrentUser: false
          });
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, token, user?.uid]);

  const handleFollow = async () => {
    if (!profile || !token) return;
    
    try {
      // Optimistic update
      setProfile(prev => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null);
      
      // Call API
      if (profile.isFollowing) {
        await unfollowUserProfile(profile.id, token, user?.uid || '');
      } else {
        await followUserProfile(profile.id, token, user?.uid || '');
      }
      
    } catch (err) {
      console.error('Failed to follow/unfollow user:', err);
      // Revert optimistic update
      setProfile(prev => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount + 1 : prev.followersCount - 1
      } : null);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const handlePostPress = (postId: string) => {
    router.push({
      pathname: '/PostDetail',
      params: { postId }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User profile not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.name}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profile.avatar }} 
            style={styles.profileAvatar}
            defaultSource={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face' }}
          />
          <Text style={styles.profileName}>{profile.name}</Text>
          {profile.credentials && (
            <Text style={styles.profileCredentials}>{profile.credentials}</Text>
          )}
          
          {/* Follow Button */}
          {!profile.isCurrentUser && (
            <TouchableOpacity
              style={[styles.followButton, profile.isFollowing && styles.followingButton]}
              onPress={handleFollow}
            >
              <Text style={[styles.followButtonText, profile.isFollowing && styles.followingButtonText]}>
                {profile.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'posts' ? (
          <View style={styles.postsContainer}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postItem}
                  onPress={() => handlePostPress(post.id)}
                >
                  <Text style={styles.postQuestion} numberOfLines={2}>
                    {post.question}
                  </Text>
                  <Text style={styles.postAnswer} numberOfLines={3}>
                    {post.answer}
                  </Text>
                  <View style={styles.postStats}>
                    <View style={styles.postStat}>
                      <Ionicons name="arrow-up-outline" size={16} color="#666" />
                      <Text style={styles.postStatText}>{post.upvotes}</Text>
                    </View>
                    <View style={styles.postStat}>
                      <Ionicons name="chatbubble-outline" size={16} color="#666" />
                      <Text style={styles.postStatText}>{post.comments}</Text>
                    </View>
                    <View style={styles.postStat}>
                      <Ionicons name="share-outline" size={16} color="#666" />
                      <Text style={styles.postStatText}>{post.shares}</Text>
                    </View>
                    <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyPostsContainer}>
                <Ionicons name="document-outline" size={48} color="#ccc" />
                <Text style={styles.emptyPostsText}>No posts yet</Text>
                <Text style={styles.emptyPostsSubtext}>This user hasn't shared any posts.</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.aboutContainer}>
            {profile.bio && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Bio</Text>
                <Text style={styles.aboutText}>{profile.bio}</Text>
              </View>
            )}
            
            {profile.location && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Location</Text>
                <Text style={styles.aboutText}>{profile.location}</Text>
              </View>
            )}
            
            {profile.website && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Website</Text>
                <TouchableOpacity>
                  <Text style={styles.websiteLink}>{profile.website}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Joined</Text>
              <Text style={styles.aboutText}>{formatDate(profile.joinDate)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  moreButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  profileCredentials: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    marginBottom: 20,
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  postsContainer: {
    padding: 16,
  },
  postItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  postQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  postAnswer: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyPostsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPostsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyPostsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  aboutContainer: {
    padding: 16,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  websiteLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfile; 