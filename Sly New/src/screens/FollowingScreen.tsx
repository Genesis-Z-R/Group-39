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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';

interface FollowedItem {
  id: string;
  name: string;
  type: 'user' | 'topic';
  avatar?: string;
  description?: string;
  followers?: number;
  posts?: number;
  isFollowing: boolean;
}

const mockFollowing: FollowedItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
    description: 'Tech enthusiast and mobile developer',
    followers: 1247,
    posts: 89,
    isFollowing: true,
  },
  {
    id: '2',
    name: 'React Native',
    type: 'topic',
    description: 'Mobile app development with React Native',
    followers: 15420,
    posts: 2341,
    isFollowing: true,
  },
  {
    id: '3',
    name: 'Michael Chen',
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    description: 'UI/UX Designer and creative thinker',
    followers: 892,
    posts: 156,
    isFollowing: true,
  },
  {
    id: '4',
    name: 'Mobile Development',
    type: 'topic',
    description: 'All things mobile app development',
    followers: 8920,
    posts: 1247,
    isFollowing: true,
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    description: 'Startup founder and tech blogger',
    followers: 2341,
    posts: 234,
    isFollowing: true,
  },
];

export default function FollowingScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [following, setFollowing] = useState<FollowedItem[]>(mockFollowing);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'users' | 'topics'>('all');

  const handleUnfollow = (itemId: string) => {
    setFollowing(prevFollowing =>
      prevFollowing.map(item =>
        item.id === itemId ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  const filteredFollowing = following.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderFollowedItem = ({ item }: { item: FollowedItem }) => (
    <View style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.itemHeader}>
        {item.type === 'user' ? (
          <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={20} color="#ffffff" />
          </View>
        ) : (
          <View style={[styles.topicIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="bookmark" size={20} color="#ffffff" />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
          {item.description && (
            <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.itemMeta}>
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {item.followers?.toLocaleString()} followers
            </Text>
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {item.posts} posts
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          {
            backgroundColor: item.isFollowing ? theme.colors.border : theme.colors.primary,
            borderColor: theme.colors.border,
          }
        ]}
        onPress={() => handleUnfollow(item.id)}
      >
        <Text style={[
          styles.followButtonText,
          { color: item.isFollowing ? theme.colors.textSecondary : '#ffffff' }
        ]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterButton = ({ item }: { item: { key: string; label: string; value: 'all' | 'users' | 'topics' } }) => (
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
    { key: 'users', label: 'Users', value: 'users' as const },
    { key: 'topics', label: 'Topics', value: 'topics' as const },
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Following</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search following..."
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

      {/* Following List */}
      <FlatList
        data={filteredFollowing}
        renderItem={renderFollowedItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.followingList}
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
  followingList: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 