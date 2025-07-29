import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';
import { Question } from '../types';

const mockMyQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement drawer navigation in React Native?',
    content: 'I want to add a drawer navigation to my React Native app. What are the best practices and recommended libraries?',
    tags: ['react-native', 'navigation', 'drawer'],
    author: {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      profileImage: '',
      bio: '',
      location: '',
      website: '',
      reputation: 150,
      followers: 45,
      following: 23,
      isVerified: false,
      createdAt: new Date(),
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    upvotes: 12,
    downvotes: 2,
    views: 156,
    shares: 5,
    answers: 3,
    isAnswered: true,
    userVote: 'up',
  },
  {
    id: '2',
    title: 'Best practices for Firebase authentication',
    content: 'What are the recommended security practices when implementing Firebase authentication in a React Native app?',
    tags: ['firebase', 'authentication', 'security'],
    author: {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      profileImage: '',
      bio: '',
      location: '',
      website: '',
      reputation: 150,
      followers: 45,
      following: 23,
      isVerified: false,
      createdAt: new Date(),
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    upvotes: 8,
    downvotes: 1,
    views: 89,
    shares: 2,
    answers: 1,
    isAnswered: false,
    userVote: null,
  },
  {
    id: '3',
    title: 'State management with Redux vs Context API',
    content: 'Which state management solution should I use for my React Native project? Pros and cons of each approach.',
    tags: ['redux', 'context-api', 'state-management'],
    author: {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      profileImage: '',
      bio: '',
      location: '',
      website: '',
      reputation: 150,
      followers: 45,
      following: 23,
      isVerified: false,
      createdAt: new Date(),
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    upvotes: 15,
    downvotes: 3,
    views: 234,
    shares: 8,
    answers: 5,
    isAnswered: true,
    userVote: 'up',
  },
];

export default function MyQuestionsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [questions, setQuestions] = useState<Question[]>(mockMyQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'answered' | 'unanswered'>('all');

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail', { questionId });
  };

  const handleEditQuestion = (questionId: string) => {
    navigation.navigate('EditQuestion', { questionId });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'answered' && question.isAnswered) ||
                         (selectedFilter === 'unanswered' && !question.isAnswered);
    return matchesSearch && matchesFilter;
  });

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={[styles.questionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.questionHeader}>
        <View style={styles.questionMeta}>
          <Text style={[styles.questionTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.questionContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
        <View style={styles.questionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditQuestion(item.id)}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteQuestion(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.questionStats}>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {item.views}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {item.answers}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="arrow-up" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {item.upvotes - item.downvotes}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="share-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {item.shares}
          </Text>
        </View>
      </View>
      
      <View style={styles.questionFooter}>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.statusContainer}>
          {item.isAnswered && (
            <View style={styles.answeredBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={[styles.answeredText, { color: '#4caf50' }]}>Answered</Text>
            </View>
          )}
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFilterButton = ({ item }: { item: { key: string; label: string; value: 'all' | 'answered' | 'unanswered' } }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedFilter === item.value ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={() => setSelectedFilter(item.value)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: selectedFilter === item.value ? '#ffffff' : theme.colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const filterOptions = [
    { key: 'all', label: 'All', value: 'all' as const },
    { key: 'answered', label: 'Answered', value: 'answered' as const },
    { key: 'unanswered', label: 'Unanswered', value: 'unanswered' as const },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Questions</Text>
        <TouchableOpacity 
          style={styles.askButton}
          onPress={() => navigation.navigate('AskQuestion')}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search my questions..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <FlatList
        data={filterOptions}
        renderItem={renderFilterButton}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterList, { backgroundColor: theme.colors.surface }]}
        contentContainerStyle={styles.filterListContent}
      />

      {/* Questions List */}
      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.questionsList}
        style={{ backgroundColor: theme.colors.background }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  askButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterList: {
    borderBottomWidth: 1,
  },
  filterListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  questionsList: {
    padding: 16,
  },
  questionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionMeta: {
    flex: 1,
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  questionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  answeredText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
  },
}); 