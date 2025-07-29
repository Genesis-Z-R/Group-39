import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '../types';
import UserAvatar from './UserAvatar';
import ImageViewer from './ImageViewer';
import ShareModal from './ShareModal';
import FactCheckModal from './FactCheckModal';
import { useTheme } from '../utils/ThemeContext';

interface QuestionCardProps {
  question: Question;
  onPress: (questionId: string) => void;
  onUserPress?: (userId: string) => void;
}

export default function QuestionCard({ question, onPress, onUserPress }: QuestionCardProps) {
  const { theme } = useTheme();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isFactCheckModalVisible, setIsFactCheckModalVisible] = useState(false);
  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => onPress(question.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress?.(question.author.id)}
          disabled={!onUserPress}
        >
          <UserAvatar
            size={32}
            username={question.author.username}
            avatar={question.author.avatar}
            isVerified={question.author.isVerified}
          />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {question.author.username}
              {question.author.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
              )}
            </Text>
            <Text style={[styles.reputation, { color: theme.colors.textSecondary }]}>
              {formatNumber(question.author.reputation)} reputation
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{formatDate(question.createdAt)}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {question.title}
          </Text>
          {new Date().getTime() - (question.createdAt ? new Date(question.createdAt).getTime() : 0) < 24 * 60 * 60 * 1000 && (
            <View style={[styles.newBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={3}>
          {question.content}
        </Text>
        
        {question.images && question.images.length > 0 && (
          <View style={styles.imageContainer}>
            <ImageViewer images={question.images.slice(0, 3)} />
          </View>
        )}
      </View>

      <View style={styles.tags}>
        {question.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.tagText, { color: theme.colors.primary }]}>{tag}</Text>
          </View>
        ))}
        {question.tags.length > 3 && (
          <Text style={[styles.moreTags, { color: theme.colors.textSecondary }]}>+{question.tags.length - 3}</Text>
        )}
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{formatNumber(question.views)}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{question.answers.length}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="arrow-up-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{formatNumber(question.upvotes)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.stat}
          onPress={() => setIsShareModalVisible(true)}
        >
          <Ionicons name="share-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{formatNumber(question.shares || 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.stat}
          onPress={() => setIsFactCheckModalVisible(true)}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>Fact Check</Text>
        </TouchableOpacity>
        {question.isAnswered && (
          <View style={styles.answeredBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
            <Text style={styles.answeredText}>Answered</Text>
          </View>
        )}
      </View>
      
      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        question={question}
        onShareSuccess={() => {
          // You can add logic here to update share count or show success message
          console.log('Question shared successfully');
        }}
      />
      
      <FactCheckModal
        visible={isFactCheckModalVisible}
        onClose={() => setIsFactCheckModalVisible(false)}
        question={question}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 2,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reputation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 22,
    flex: 1,
    marginRight: 8,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answeredText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
    marginLeft: 4,
  },
}); 