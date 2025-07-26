import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../src/context/authContext';
import { fetchPostDetail, trackPostView, fetchCommentsPaginated, upvotePost, sharePost } from '../src/services/api';
import { PostDetailResponse, CommentInfo } from '../src/types';
import FactCheckModal from './components/FactCheckModal';
import ShareModal from './components/ShareModal';

const PostDetail: React.FC = () => {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isFactCheckModalVisible, setIsFactCheckModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  // Load post detail
  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch post detail from API
        const postData = await fetchPostDetail(postId as string, user?.uid, token);
        setPost(postData);
        
        // Track view
        await trackPostView(postId as string, token);
        
        // Load initial comments
        const commentsData = await fetchCommentsPaginated(postId as string, 0, 10, token);
        setComments(commentsData);
        
      } catch (err) {
        console.error('Failed to load post detail:', err);
        setError('Failed to load post. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPostDetail();
  }, [postId, token, user?.uid]);

  // Load more comments
  const loadMoreComments = async () => {
    if (!postId || loadingComments) return;
    
    try {
      setLoadingComments(true);
      const nextPage = commentsPage + 1;
      const newComments = await fetchCommentsPaginated(postId as string, nextPage, 10, token);
      
      if (newComments.length > 0) {
        setComments(prev => [...prev, ...newComments]);
        setCommentsPage(nextPage);
      }
    } catch (err) {
      console.error('Failed to load more comments:', err);
      Alert.alert('Error', 'Failed to load more comments');
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle upvote
  const handleUpvote = async () => {
    if (!post || !token) return;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        isUpvoted: !prev.isUpvoted,
        upvotes: prev.isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1
      } : null);
      
      // Call API
      await upvotePost(post.id.toString(), token);
    } catch (err) {
      console.error('Failed to upvote:', err);
      // Revert optimistic update
      setPost(prev => prev ? {
        ...prev,
        isUpvoted: !prev.isUpvoted,
        upvotes: prev.isUpvoted ? prev.upvotes + 1 : prev.upvotes - 1
      } : null);
      Alert.alert('Error', 'Failed to upvote post');
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!post || !token) return;
    
    try {
      const shareData = {
        shareType: 'native',
        platform: 'app',
        userAgent: 'Bisa Mobile App'
      };
      
      await sharePost(post.id.toString(), token, shareData);
      
      // Update share count
      setPost(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
    } catch (err) {
      console.error('Failed to share:', err);
      Alert.alert('Error', 'Failed to share post');
    }
  };

  // Handle fact check
  const handleFactCheck = () => {
    setIsFactCheckModalVisible(true);
  };

  // Handle follow
  const handleFollow = () => {
    if (!post) return;
    Alert.alert('Follow', `Follow ${post.user.name}`);
  };

  const handleUserPress = () => {
    if (!post) return;
    router.push({
      pathname: '/UserProfile',
      params: { userId: post.user.id.toString() }
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
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
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
          <Text style={styles.errorText}>{error || 'Post not found'}</Text>
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
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.userInfoTouchable}
            onPress={handleUserPress}
          >
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.credentials && (
                <Text style={styles.userCredentials}>{post.user.credentials}</Text>
              )}
              <Text style={styles.timestamp}>{formatTime(post.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>
              {post.user.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <Text style={styles.question}>{post.question}</Text>

        {/* Answer */}
        <Text style={styles.answer}>{post.answer}</Text>

        {/* Media */}
        {post.mediaUrl && (
          <View style={styles.mediaContainer}>
            {post.mediaType === 'video' ? (
              <Video
                source={{ uri: post.mediaUrl }}
                style={styles.media}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Image source={{ uri: post.mediaUrl }} style={styles.media} />
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, post.isUpvoted && styles.upvotedButton]}
            onPress={handleUpvote}
          >
            <Ionicons 
              name={post.isUpvoted ? 'arrow-up' : 'arrow-up-outline'} 
              size={24} 
              color={post.isUpvoted ? '#FF6B35' : '#666'} 
            />
            <Text style={[styles.actionText, post.isUpvoted && styles.upvotedText]}>
              {post.upvotes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleFactCheck}>
            <Ionicons name="alert-circle-outline" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({post.commentsCount})</Text>
          
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
              </View>
            </View>
          ))}
          
          {comments.length < post.commentsCount && (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={loadMoreComments}
              disabled={loadingComments}
            >
              {loadingComments ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.loadMoreText}>Load More Comments</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Fact Check Modal */}
      <FactCheckModal
        visible={isFactCheckModalVisible}
        onClose={() => setIsFactCheckModalVisible(false)}
        postId={post.id.toString()}
        postContent={`${post.question}\n\n${post.answer}`}
      />

      {/* Share Modal */}
      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        post={{
          id: post.id.toString(),
          question: post.question,
          answer: post.answer,
          user: { name: post.user.name },
        }}
        onShareSuccess={() => {
          setPost(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
          setIsShareModalVisible(false);
        }}
      />
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  userInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 28,
  },
  answer: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 24,
  },
  mediaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  media: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  upvotedButton: {
    backgroundColor: '#FFF5F3',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  upvotedText: {
    color: '#FF6B35',
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  loadMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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

export default PostDetail; 