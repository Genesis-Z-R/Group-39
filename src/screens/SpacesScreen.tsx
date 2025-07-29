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

interface Space {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  category: string;
  image?: string;
}

const mockSpaces: Space[] = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'A community for technology lovers and developers',
    memberCount: 1247,
    isJoined: true,
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Design & Creativity',
    description: 'Share your creative work and get feedback',
    memberCount: 892,
    isJoined: false,
    category: 'Design',
  },
  {
    id: '3',
    name: 'Startup Founders',
    description: 'Connect with fellow entrepreneurs',
    memberCount: 567,
    isJoined: true,
    category: 'Business',
  },
  {
    id: '4',
    name: 'Mobile Development',
    description: 'React Native, Flutter, and mobile app development',
    memberCount: 2341,
    isJoined: false,
    category: 'Technology',
  },
  {
    id: '5',
    name: 'UI/UX Designers',
    description: 'User interface and experience design community',
    memberCount: 756,
    isJoined: true,
    category: 'Design',
  },
];

export default function SpacesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [spaces, setSpaces] = useState<Space[]>(mockSpaces);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Technology', 'Design', 'Business', 'Education'];

  const handleJoinSpace = (spaceId: string) => {
    setSpaces(prevSpaces =>
      prevSpaces.map(space =>
        space.id === spaceId ? { ...space, isJoined: !space.isJoined } : space
      )
    );
  };

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || space.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderSpaceItem = ({ item }: { item: Space }) => (
    <View style={[styles.spaceCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.spaceHeader}>
        <View style={[styles.spaceIcon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="people" size={24} color="#ffffff" />
        </View>
        <View style={styles.spaceInfo}>
          <Text style={[styles.spaceName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.spaceDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.spaceMeta}>
            <Text style={[styles.memberCount, { color: theme.colors.textSecondary }]}>
              {item.memberCount} members
            </Text>
            <Text style={[styles.category, { color: theme.colors.primary }]}>
              {item.category}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.joinButton,
          {
            backgroundColor: item.isJoined ? theme.colors.border : theme.colors.primary,
            borderColor: theme.colors.border,
          }
        ]}
        onPress={() => handleJoinSpace(item.id)}
      >
        <Text style={[
          styles.joinButtonText,
          { color: item.isJoined ? theme.colors.textSecondary : '#ffffff' }
        ]}>
          {item.isJoined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        {
          backgroundColor: selectedCategory === item ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={() => setSelectedCategory(item === selectedCategory ? null : item)}
    >
      <Text style={[
        styles.categoryFilterText,
        { color: selectedCategory === item ? '#ffffff' : theme.colors.text }
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Spaces</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search spaces..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filters */}
      <FlatList
        data={categories}
        renderItem={renderCategoryFilter}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.categoryList, { backgroundColor: theme.colors.surface }]}
        contentContainerStyle={styles.categoryListContent}
      />

      {/* Spaces List */}
      <FlatList
        data={filteredSpaces}
        renderItem={renderSpaceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.spacesList}
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
  createButton: {
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
  categoryList: {
    borderBottomWidth: 1,
  },
  categoryListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  spacesList: {
    padding: 16,
  },
  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  spaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  spaceDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  spaceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    fontSize: 12,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 