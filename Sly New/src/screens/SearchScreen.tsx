import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import QuestionCard from '../components/QuestionCard';
import { Question, User, Tag } from '../types';
import { useTheme } from '../utils/ThemeContext';
import { searchQuestions, searchUsers } from '../services/mockData';
import UserAvatar from '../components/UserAvatar';

type SearchScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
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
];

const mockTags: Tag[] = [
  { id: '1', name: 'react-native', description: 'React Native development', questionCount: 1250, followers: 890 },
  { id: '2', name: 'javascript', description: 'JavaScript programming', questionCount: 3200, followers: 2100 },
  { id: '3', name: 'typescript', description: 'TypeScript development', questionCount: 980, followers: 650 },
];

type SearchType = 'questions' | 'users' | 'tags';

export default function SearchScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('questions');
  const [searchResults, setSearchResults] = useState<Question[]>(mockQuestions);
  const [userResults, setUserResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      if (searchType === 'questions') {
        setSearchResults(searchQuestions(query));
      } else if (searchType === 'users') {
        setUserResults(searchUsers(query));
      }
      // tags can be added similarly
    } else {
      setSearchResults([]);
      setUserResults([]);
    }
  };

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail', { questionId });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleTagPress = (tagName: string) => {
    navigation.navigate('TagQuestions', { tagName });
  };

  const SearchTypeButton = ({ type, label }: { type: SearchType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.typeButton, 
        { backgroundColor: theme.colors.surface },
        searchType === type && [styles.typeButtonActive, { backgroundColor: theme.colors.primary }]
      ]}
      onPress={() => setSearchType(type)}
    >
      <Text style={[
        styles.typeButtonText, 
        { color: searchType === type ? '#ffffff' : theme.colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderUserResults = () => {
    if (!searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>Search for users by name, username, or email</Text>
        </View>
      );
    }
    if (userResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>No users found for "{searchQuery}"</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={userResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item.id)}>
            <UserAvatar username={item.username} avatar={item.avatar} isVerified={item.isVerified} size={40} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userUsername}>@{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const renderSearchResults = () => {
    if (searchType === 'users') {
      return renderUserResults();
    }
    if (!searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>Search for questions, users, or tags</Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>No results found for "{searchQuery}"</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults}
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
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search questions, users, or tags..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.typeContainer, { backgroundColor: theme.colors.surface }]}>
        <SearchTypeButton type="questions" label="Questions" />
        <SearchTypeButton type="users" label="Users" />
        <SearchTypeButton type="tags" label="Tags" />
      </View>

      {renderSearchResults()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  typeButtonActive: {
    backgroundColor: '#1a73e8',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  listContainer: {
    paddingVertical: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  userUsername: {
    fontSize: 14,
    color: '#888',
  },
}); 