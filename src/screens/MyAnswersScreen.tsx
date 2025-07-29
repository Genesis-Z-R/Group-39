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

interface Answer {
  id: string;
  questionTitle: string;
  questionId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  tags: string[];
}

const mockMyAnswers: Answer[] = [
  {
    id: '1',
    questionTitle: 'How to implement drawer navigation in React Native?',
    questionId: 'q1',
    content: 'You can use @react-navigation/drawer package. Here\'s a complete example...',
    createdAt: new Date('2024-01-20'),
    upvotes: 15,
    downvotes: 2,
    isAccepted: true,
    tags: ['react-native', 'navigation'],
  },
  {
    id: '2',
    questionTitle: 'Best practices for Firebase authentication',
    questionId: 'q2',
    content: 'Always implement proper security rules and use email verification...',
    createdAt: new Date('2024-01-18'),
    upvotes: 8,
    downvotes: 1,
    isAccepted: false,
    tags: ['firebase', 'authentication'],
  },
  {
    id: '3',
    questionTitle: 'State management with Redux vs Context API',
    questionId: 'q3',
    content: 'For smaller apps, Context API is sufficient. For larger apps, Redux provides better tooling...',
    createdAt: new Date('2024-01-15'),
    upvotes: 12,
    downvotes: 3,
    isAccepted: false,
    tags: ['redux', 'context-api'],
  },
];

export default function MyAnswersScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [answers, setAnswers] = useState<Answer[]>(mockMyAnswers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'accepted' | 'pending'>('all');

  const handleAnswerPress = (questionId: string) => {
    navigation.navigate('QuestionDetail', { questionId });
  };

  const handleEditAnswer = (answerId: string) => {
    navigation.navigate('EditAnswer', { answerId });
  };

  const handleDeleteAnswer = (answerId: string) => {
    setAnswers(prevAnswers => prevAnswers.filter(a => a.id !== answerId));
  };

  const filteredAnswers = answers.filter(answer => {
    const matchesSearch = answer.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         answer.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         answer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'accepted' && answer.isAccepted) ||
                         (selectedFilter === 'pending' && !answer.isAccepted);
    return matchesSearch && matchesFilter;
  });

  const renderAnswerItem = ({ item }: { item: Answer }) => (
    <View style={[styles.answerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.answerHeader}>
        <View style={styles.answerMeta}>
          <Text style={[styles.questionTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.questionTitle}
          </Text>
          <Text style={[styles.answerContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
        <View style={styles.answerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAnswer(item.id)}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAnswer(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.answerStats}>
        <View style={styles.statItem}>
          <Ionicons name="arrow-up" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {item.upvotes - item.downvotes}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={16} color={item.isAccepted ? '#4caf50' : theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: item.isAccepted ? '#4caf50' : theme.colors.textSecondary }]}>
            {item.isAccepted ? 'Accepted' : 'Pending'}
          </Text>
        </View>
      </View>
      
      <View style={styles.answerFooter}>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderFilterButton = ({ item }: { item: { key: string; label: string; value: 'all' | 'accepted' | 'pending' } }) => (
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
    { key: 'accepted', label: 'Accepted', value: 'accepted' as const },
    { key: 'pending', label: 'Pending', value: 'pending' as const },
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Answers</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search my answers..."
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

      {/* Answers List */}
      <FlatList
        data={filteredAnswers}
        renderItem={renderAnswerItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.answersList}
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
  headerSpacer: {
    width: 40,
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
  answersList: {
    padding: 16,
  },
  answerCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  answerMeta: {
    flex: 1,
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  answerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  answerStats: {
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
  answerFooter: {
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
  dateText: {
    fontSize: 12,
  },
}); 