import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import QuestionCard from '../components/QuestionCard';
import { Question, User } from '../types';
import { useTheme } from '../utils/ThemeContext';
import { useQuestions } from '../utils/QuestionsContext';
import Logo from '../components/Logo';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'MainTabs'>;



type FilterType = 'latest' | 'popular' | 'unanswered' | 'trending';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { questions } = useQuestions();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [filter, setFilter] = useState<FilterType>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const [showNewQuestionMessage, setShowNewQuestionMessage] = useState(false);

  // Show success message when returning from AskScreen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check if we just posted a question (you could add a flag in navigation params)
      // For now, we'll just show a brief message
    });
    return unsubscribe;
  }, [navigation]);

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail', { questionId });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredQuestions = () => {
    switch (filter) {
      case 'popular':
        return [...questions].sort((a, b) => b.upvotes - a.upvotes);
      case 'unanswered':
        return questions.filter(q => !q.isAnswered);
      case 'trending':
        return [...questions].sort((a, b) => b.views - a.views);
      default:
        return [...questions].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
    }
  };

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton, 
        { backgroundColor: theme.colors.surface },
        filter === type && [styles.filterButtonActive, { backgroundColor: theme.colors.primary }]
      ]}
      onPress={() => setFilter(type)}
    >
      <Text style={[
        styles.filterButtonText, 
        { color: filter === type ? '#ffffff' : theme.colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.logoContainer}>
          <Logo size="small" showText={false} />
          <Text style={[styles.title, { color: theme.colors.text }]}>BISA</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <FilterButton type="latest" label="Latest" />
        <FilterButton type="popular" label="Popular" />
        <FilterButton type="unanswered" label="Unanswered" />
        <FilterButton type="trending" label="Trending" />
      </View>

      <FlatList
        data={getFilteredQuestions()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard
            question={item}
            onPress={handleQuestionPress}
            onUserPress={handleUserPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  filterButtonActive: {
    // Background color handled dynamically
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    // Color handled dynamically
  },
  listContainer: {
    paddingVertical: 8,
  },
}); 