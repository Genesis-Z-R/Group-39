// screens/FeedScreen.tsx - Ready to use with real API data
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
  Modal
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/authContext';
import { fetchPosts, upvotePost, sharePost } from '../../src/services/api';
import FactCheckModal from '../components/FactCheckModal';
import ShareModal from '../components/ShareModal';

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  credentials?: string;
}

interface Post {
  id: string;
  user: User;
  question: string;
  answer: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  upvotes: number;
  comments: number;
  shares: number;
  isUpvoted: boolean;
  createdAt: string;
}

// Mock data as fallback
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      credentials: 'PhD in Computer Science, Former Google Engineer'
    },
    question: 'What are the most important programming concepts every developer should master?',
    answer: 'After 15 years in the industry, I believe these are the fundamental concepts: 1) Data structures and algorithms - Understanding how to efficiently store and manipulate data. 2) Object-oriented programming principles - Encapsulation, inheritance, and polymorphism. 3) Database design and SQL - Most applications need to store data. 4) Version control with Git - Essential for collaboration. 5) Testing - Writing maintainable code requires good testing practices.',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    mediaType: 'image',
    upvotes: 234,
    comments: 45,
    shares: 12,
    isUpvoted: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      credentials: 'Senior Software Engineer at Microsoft'
    },
    question: 'How do you stay motivated while learning to code?',
    answer: 'Learning to code can be challenging, but here are strategies that worked for me: Build projects you care about - passion projects keep you engaged. Join coding communities - surrounding yourself with other learners creates accountability. Celebrate small wins - every bug fixed is progress. Take breaks - burnout is real, rest is important. Remember why you started - keep your end goal in mind.',
    upvotes: 189,
    comments: 67,
    shares: 23,
    isUpvoted: true,
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      credentials: 'UX Designer at Apple'
    },
    question: 'What makes a good user interface design?',
    answer: 'Great UI design is invisible to users. Here are key principles: Consistency - use familiar patterns and maintain visual hierarchy. Simplicity - remove unnecessary elements that don\'t serve a purpose. Accessibility - design for users with different abilities. Feedback - provide clear responses to user interactions. Performance - fast loading and smooth animations are crucial for good UX.',
    upvotes: 156,
    comments: 34,
    shares: 9,
    isUpvoted: false,
    createdAt: '2024-01-13T09:20:00Z'
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      credentials: 'Entrepreneur, Founded 3 startups'
    },
    question: 'What\'s the biggest mistake first-time entrepreneurs make?',
    answer: 'The biggest mistake is building something nobody wants. Many entrepreneurs fall in love with their idea without validating it with real customers. Before writing a single line of code or investing significant time, talk to potential customers. Understand their pain points. Build a minimum viable product (MVP) and get feedback early and often. Pivot when necessary - being attached to a bad idea will sink your startup.',
    upvotes: 445,
    comments: 89,
    shares: 34,
    isUpvoted: true,
    createdAt: '2024-01-12T14:10:00Z'
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      credentials: 'Data Scientist at Netflix'
    },
    question: 'How is machine learning changing the entertainment industry?',
    answer: 'ML is revolutionizing entertainment in several ways: Personalized recommendations - algorithms analyze viewing patterns to suggest content you\'ll love. Content creation - AI helps in scriptwriting, music composition, and even generating visual effects. Audience insights - ML helps studios understand what content resonates with different demographics. Production optimization - from scheduling to budget allocation, ML improves efficiency across the pipeline.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    mediaType: 'image',
    upvotes: 267,
    comments: 52,
    shares: 15,
    isUpvoted: false,
    createdAt: '2024-01-11T11:25:00Z'
  }
];

const Mockfeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [isFactCheckModalVisible, setIsFactCheckModalVisible] = useState(false);
  const [selectedPostForFactCheck, setSelectedPostForFactCheck] = useState<Post | null>(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedPostForShare, setSelectedPostForShare] = useState<Post | null>(null);

  const { token } = useAuth();
  const router = useRouter();

  const loadPosts = useCallback(async (isRefresh: boolean = false) => {
    console.log('Mockfeed: loadPosts called, token:', !!token);
    if (isRefresh) setRefreshing(true);
    else setLoadingMore(true);
    
    try {
      if (token) {
        console.log('Mockfeed: Attempting to fetch posts from backend...');
        const data = await fetchPosts(token);
        console.log('Mockfeed: Backend response:', data);
        
        // Transform backend data to match frontend format
        const transformedPosts = data.map((post: any) => ({
          id: post.id.toString(),
          user: {
            id: post.user.id.toString(),
            name: post.user.name,
            avatar: post.user.avatar,
            credentials: post.user.credentials
          },
          question: post.question,
          answer: post.answer,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType,
          upvotes: post.upvotes,
          comments: post.comments || 0,
          shares: post.shares,
          isUpvoted: post.isUpvoted || false,
          createdAt: post.createdAt
        }));
        
        setPosts(transformedPosts);
        setUsingMockData(false);
        setError(null);
      } else {
        // No token available, use mock data
        console.log('Mockfeed: No token available, using mock data');
        setPosts(mockPosts);
        setUsingMockData(true);
        setError(null);
      }
    } catch (error) {
      console.error('Mockfeed: Failed to fetch posts from backend. Using sample posts.', error);
      setPosts(mockPosts);
      setUsingMockData(true);
      setError('Failed to load posts from server');
    } finally {
      console.log('Mockfeed: Setting loading to false');
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    console.log('Mockfeed: Starting to load posts...');
    setLoading(true);
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Mockfeed: Loading timeout, showing mock data');
      setPosts(mockPosts);
      setUsingMockData(true);
      setLoading(false);
    }, 5000); // 5 second timeout
    
    loadPosts(true).finally(() => {
      clearTimeout(timeoutId);
    });
  }, [loadPosts]);

  // Always show mock data if posts are empty after loading
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  const handleUpvote = async (postId: string) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isUpvoted: !post.isUpvoted,
                upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
              }
            : post
        )
      );

      // Call API if we have a token
      if (token) {
        await upvotePost(postId, token);
      }
    } catch (error) {
      console.error('Failed to upvote:', error);
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isUpvoted: !post.isUpvoted,
                upvotes: post.isUpvoted ? post.upvotes + 1 : post.upvotes - 1,
              }
            : post
        )
      );
    }
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
    setIsCommentModalVisible(true);
  };

  const handleFactCheck = (post: Post) => {
    setSelectedPostForFactCheck(post);
    setIsFactCheckModalVisible(true);
  };

  const closeFactCheckModal = () => {
    setIsFactCheckModalVisible(false);
    setSelectedPostForFactCheck(null);
  };

  const handleShare = async (postId: string) => {
    const post = posts.find((p) => p.id === postId) || mockPosts.find((p) => p.id === postId);
    if (post) {
      setSelectedPostForShare(post);
      setIsShareModalVisible(true);
    }
  };

  const handleShareSuccess = async () => {
    if (selectedPostForShare && token) {
      try {
        // Call API
        await sharePost(selectedPostForShare.id, token, {
          shareType: 'native',
          platform: 'app',
          userAgent: 'Bisa Mobile App'
        });
        
        // Update UI
        setPosts((prev) =>
          prev.map((post) =>
            post.id === selectedPostForShare.id
              ? { ...post, shares: post.shares + 1 }
              : post
          )
        );
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
    setIsShareModalVisible(false);
    setSelectedPostForShare(null);
  };

  const handleFollow = (userId: string) => {
    Alert.alert('Follow', `Follow user ${userId}`);
  };

  const handleReadMore = (post: Post) => {
    router.push({
      pathname: '/PostDetail',
      params: { postId: post.id }
    });
  };

  const handleUserPress = (user: User) => {
    router.push({
      pathname: '/UserProfile',
      params: { userId: user.id }
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

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <TouchableOpacity 
          style={styles.userInfoTouchable}
          onPress={() => handleUserPress(item.user)}
        >
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.user.name}</Text>
            {item.user.credentials && <Text style={styles.userCredentials}>{item.user.credentials}</Text>}
            <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followButton} onPress={() => handleFollow(item.user.id)}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.question}>{item.question}</Text>

      <ReadMore
        numberOfLines={3}
        renderTruncatedFooter={(handlePress:any) => (
          <TouchableOpacity onPress={() => handleReadMore(item)}>
            <Text style={{ color: '#007AFF', marginTop: 4 }}>Read More</Text>
          </TouchableOpacity>
        )}
        renderRevealedFooter={(handlePress: any) => (
          <Text style={{ color: '#007AFF', marginTop: 4 }} onPress={handlePress}>Show Less</Text>
        )}
      >
        <Text style={styles.answer}>{item.answer}</Text>
      </ReadMore>

      {item.mediaUrl && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, item.isUpvoted && styles.upvotedButton]}
          onPress={() => handleUpvote(item.id)}
        >
          <Ionicons name={item.isUpvoted ? 'arrow-up' : 'arrow-up-outline'} size={20} color={item.isUpvoted ? '#FF6B35' : '#666'} />
          <Text style={[styles.actionText, item.isUpvoted && styles.upvotedText]}>{item.upvotes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item.id)}>
          <Ionicons name="share-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleFactCheck(item)}>
          <Ionicons name="alert-circle-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingMoreText}>Loading more posts...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mock Data Banner */}
      {usingMockData && (
        <View style={styles.mockDataBanner}>
          <Text style={styles.mockDataBannerText}>Offline mode: Showing sample data</Text>
          <TouchableOpacity onPress={() => loadPosts(true)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Error Banner */}
      {error && !usingMockData && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => loadPosts(true)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={displayPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadPosts(true)} />}
        onEndReached={() => loadPosts(false)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Comment Modal */}
      <Modal visible={isCommentModalVisible} animationType="slide" onRequestClose={() => setIsCommentModalVisible(false)}>
        <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Comments for Post {selectedPostId}
          </Text>

          {/* TODO: Fetch and display real comments from API */}

          <TextInput
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 }}
          />
          <Button
            title="Post Comment"
            onPress={() => {
              if (selectedPostId) {
                console.log('Post comment to backend:', commentText);
                // TODO: Send comment to API
              }
              setCommentText('');
              setIsCommentModalVisible(false);
            }}
          />
          <Button title="Close" onPress={() => setIsCommentModalVisible(false)} />
        </View>
      </Modal>

      {/* Fact Check Modal */}
      {selectedPostForFactCheck && (
        <FactCheckModal
          visible={isFactCheckModalVisible}
          onClose={closeFactCheckModal}
          postId={selectedPostForFactCheck.id}
          postContent={`${selectedPostForFactCheck.question}\n\n${selectedPostForFactCheck.answer}`}
        />
      )}

      {selectedPostForShare && (
        <ShareModal
          visible={isShareModalVisible}
          onClose={() => {
            setIsShareModalVisible(false);
            setSelectedPostForShare(null);
          }}
          post={{
            id: selectedPostForShare.id,
            question: selectedPostForShare.question,
            answer: selectedPostForShare.answer,
            user: { name: selectedPostForShare.user.name },
          }}
          onShareSuccess={handleShareSuccess}
        />
      )}
    </View>
  );
};

// ... (keep your styles from original)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  userCredentials: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  followButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 24,
  },
  answer: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  upvotedButton: {
    backgroundColor: '#FFF5F3',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  upvotedText: {
    color: '#FF6B35',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  mockDataBanner: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockDataBannerText: {
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
  errorBanner: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#721c24',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Mockfeed;