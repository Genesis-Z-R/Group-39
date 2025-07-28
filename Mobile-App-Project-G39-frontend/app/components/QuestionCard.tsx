import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal, Animated } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { followUser, sharePost, performFactCheck, upvotePost } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ReadMore from 'react-native-read-more-text';
import ShareModal from './ShareModal';
import ShareAnalytics from './ShareAnalytics';

interface User {
  id: string;
  name: string;
  avatar: string;
  credentials?: string;
}

interface QuestionCardProps {
  post: {
    id: string;
    user: User;
    question: string;
    answer?: string;
    upvotes: number;
    shares?: number;
    isUpvoted: boolean;
    createdAt: string;
    mediaUrl?: string;
    mediaType?: string;
  };
  onPress?: () => void;
  onUpvote?: () => void;
  onComment?: (comment: string) => void;
  onShare?: () => void;
  onFollow?: () => void;
  onOpenComments?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ post, onPress, onUpvote, onComment, onShare, onFollow, onOpenComments }) => {
  const { token, user } = useAuth();
  const [upvoted, setUpvoted] = useState(post.isUpvoted);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [shares, setShares] = useState(post.shares || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<string | null>(null);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareAnalytics, setShowShareAnalytics] = useState(false);
  const [upvoteAnim] = useState(new Animated.Value(1));

  const handleUpvote = async () => {
    setUpvoted(!upvoted);
    setUpvotes(upvoted ? upvotes - 1 : upvotes + 1);
    Animated.sequence([
      Animated.timing(upvoteAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(upvoteAnim, { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    try {
      await upvotePost(post.id, token);
    } catch {
      setUpvoted(upvoted);
      setUpvotes(upvotes);
      Alert.alert('Error', 'Failed to upvote');
    }
  };

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    try {
      await followUser(post.user.id, token, user?.uid || '');
      Alert.alert(isFollowing ? 'Unfollowed' : 'Followed', post.user.name);
    } catch {
      setIsFollowing(isFollowing);
      Alert.alert('Error', 'Failed to follow/unfollow');
    }
  };

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleShareSuccess = () => {
    setShares(shares + 1);
    // The share API call is now handled in the ShareModal
  };

  const handleFactCheck = async () => {
    setShowFactCheck(true);
    setFactCheckResult('Checking...');
    try {
      const result = await performFactCheck(post.id, token);
      setFactCheckResult(result.message || 'Fact check complete.');
    } catch {
      setFactCheckResult('Fact check failed.');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.name}</Text>
          {post.user.credentials && <Text style={styles.credentials}>{post.user.credentials}</Text>}
        </View>
        <TouchableOpacity style={styles.followBtn} onPress={handleFollow}>
          <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
        </TouchableOpacity>
      </View>
      {post.mediaUrl && post.mediaType === 'image' && (
        <Image source={{ uri: post.mediaUrl }} style={styles.postImage} />
      )}
      <Text style={styles.question}>{post.question}</Text>
      {post.answer && (
        <ReadMore
          numberOfLines={3}
          renderTruncatedFooter={handlePress => (
            <Text style={{ color: '#007AFF', marginTop: 4 }} onPress={handlePress}>Read More</Text>
          )}
          renderRevealedFooter={handlePress => (
            <Text style={{ color: '#007AFF', marginTop: 4 }} onPress={handlePress}>Show Less</Text>
          )}
        >
          <Text style={styles.answer}>{post.answer}</Text>
        </ReadMore>
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleUpvote} style={styles.actionBtn} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ scale: upvoteAnim }], flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="arrow-up" size={20} color={upvoted ? '#ff4757' : '#57606f'} />
            <Text style={[styles.upvoteBadgeText, { color: upvoted ? '#ff4757' : '#57606f' }]}>{upvotes}</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenComments} style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color="#57606f" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleShare} 
          onLongPress={() => setShowShareAnalytics(true)}
          style={styles.actionBtn} 
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="share-social-outline" size={20} color="#57606f" />
            {shares > 0 && (
              <Text style={styles.shareCount}>{shares}</Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFactCheck} style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="alert-circle-outline" size={20} color="#57606f" />
        </TouchableOpacity>
      </View>
      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" onRequestClose={() => setShowComments(false)} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CommentList postId={post.id} />
            <CommentInput postId={post.id} onCommentAdded={() => setShowComments(false)} />
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Text style={{ color: 'red', textAlign: 'center', margin: 20 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Fact Check Modal */}
      <Modal visible={showFactCheck} animationType="fade" onRequestClose={() => setShowFactCheck(false)} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>AI Fact Check</Text>
            <Text>{factCheckResult}</Text>
            <TouchableOpacity onPress={() => setShowFactCheck(false)}>
              <Text style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
        onShareSuccess={handleShareSuccess}
      />

      {/* Share Analytics Modal */}
      <ShareAnalytics
        postId={post.id}
        visible={showShareAnalytics}
        onClose={() => setShowShareAnalytics(false)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2f3542',
  },
  credentials: {
    fontSize: 12,
    color: '#636e72',
  },
  followBtn: {
    backgroundColor: '#f1f2f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  followText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1e272e',
  },
  answer: {
    fontSize: 14,
    color: '#485460',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: '#dcdde3',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#57606f',
  },
  upvoteBadge: {
    position: 'absolute',
    top: -10,
    right: -12,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  upvoteBadgeText: {
    color: '#ff4757',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  shareCount: {
    color: '#57606f',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
    elevation: 6,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});

export default QuestionCard; 