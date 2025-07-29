import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackParamList, TabParamList, DrawerParamList } from '../types';
import QuestionCard from '../components/QuestionCard';
import { Question, User } from '../types';
import { useTheme } from '../utils/ThemeContext';
import { useQuestions } from '../utils/QuestionsContext';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList>,
    StackNavigationProp<StackParamList>
  >
>;



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
        { 
          backgroundColor: filter === type ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: 1,
        }
      ]}
      onPress={() => setFilter(type)}
    >
      <Text style={[
        styles.filterButtonText, 
        { color: filter === type ? '#ffffff' : theme.colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Logo size="small" showText={false} />
          <Text style={[styles.title, { color: theme.colors.text }]}>BISA</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <ThemeToggle size={20} />
        </View>
      </View>

      <ScrollView 
        style={[styles.filterContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}
        contentContainerStyle={styles.filterContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <FilterButton type="latest" label="Latest" />
        <FilterButton type="popular" label="Popular" />
        <FilterButton type="unanswered" label="Unanswered" />
        <FilterButton type="trending" label="Trending" />
        
      </ScrollView>

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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 8,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterContentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 18,
    minHeight: 36,
  },
  filterButtonActive: {
    // Background color handled dynamically
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  filterButtonTextActive: {
    // Color handled dynamically
  },
  listContainer: {
    paddingVertical: 8,
  },
}); 