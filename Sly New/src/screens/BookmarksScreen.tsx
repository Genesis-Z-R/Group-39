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

interface Bookmark {
  id: string;
  type: 'question' | 'answer';
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  votes: number;
}

const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    type: 'question',
    title: 'How to implement drawer navigation in React Native?',
    content: 'I want to add a drawer navigation to my React Native app. What are the best practices?',
    author: 'Sarah Johnson',
    date: '2 days ago',
    tags: ['react-native', 'navigation', 'drawer'],
    votes: 15,
  },
  {
    id: '2',
    type: 'answer',
    title: 'Best practices for Firebase authentication',
    content: 'Here are the recommended practices for implementing Firebase auth in your app...',
    author: 'Michael Chen',
    date: '1 week ago',
    tags: ['firebase', 'authentication', 'security'],
    votes: 23,
  },
  {
    id: '3',
    type: 'question',
    title: 'State management with Redux vs Context API',
    content: 'Which state management solution should I use for my React Native project?',
    author: 'Emily Rodriguez',
    date: '3 days ago',
    tags: ['redux', 'context-api', 'state-management'],
    votes: 8,
  },
  {
    id: '4',
    type: 'answer',
    title: 'Optimizing React Native performance',
    content: 'Here are some key techniques to improve your React Native app performance...',
    author: 'David Kim',
    date: '2 weeks ago',
    tags: ['performance', 'optimization', 'react-native'],
    votes: 31,
  },
];

export default function BookmarksScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'questions' | 'answers'>('all');

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || bookmark.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => (
    <TouchableOpacity
      style={[styles.bookmarkCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}
    >
      <View style={styles.bookmarkHeader}>
        <View style={styles.bookmarkType}>
          <Ionicons 
            name={item.type === 'question' ? 'help-circle' : 'chatbubble'} 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.typeText, { color: theme.colors.primary }]}>
            {item.type === 'question' ? 'Question' : 'Answer'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveBookmark(item.id)}
        >
          <Ionicons name="bookmark" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.bookmarkTitle, { color: theme.colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>
      
      <Text style={[styles.bookmarkContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.bookmarkMeta}>
        <View style={styles.metaLeft}>
          <Text style={[styles.authorText, { color: theme.colors.textSecondary }]}>
            {item.author}
          </Text>
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>
        <View style={styles.metaRight}>
          <View style={styles.votesContainer}>
            <Ionicons name="arrow-up" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.votesText, { color: theme.colors.textSecondary }]}>
              {item.votes}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
              {tag}
            </Text>
          </View>
        ))}
        {item.tags.length > 3 && (
          <Text style={[styles.moreTagsText, { color: theme.colors.textSecondary }]}>
            +{item.tags.length - 3} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = ({ item }: { item: { key: string; label: string; value: 'all' | 'questions' | 'answers' } }) => (
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
    { key: 'questions', label: 'Questions', value: 'questions' as const },
    { key: 'answers', label: 'Answers', value: 'answers' as const },
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Bookmarks</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search bookmarks..."
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

      {/* Bookmarks List */}
      <FlatList
        data={filteredBookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bookmarksList}
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
  bookmarksList: {
    padding: 16,
  },
  bookmarkCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bookmarkType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookmarkContent: {
    fontSize: 14,
    marginBottom: 12,
  },
  bookmarkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  votesText: {
    fontSize: 12,
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
  moreTagsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 