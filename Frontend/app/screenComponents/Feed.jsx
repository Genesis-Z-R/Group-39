import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import FeedScreen from './FeedScreen';

const generateMockPosts = (count, offset = 0) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${offset + i}`,
    user: {
      name: `User ${offset + i}`,
      avatar: `https://randomuser.me/api/portraits/men/${(offset + i) % 99}.jpg`,
    },
    question: `Question #${offset + i}: What is the meaning of life?`,
    content: `The meaning of life can vary from person to person. Some believe it's about happiness, others about purpose...`,
    postImage: ""
  }));
};

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  const loadPosts = (initial = false) => {
    if (initial) {
      setPosts(generateMockPosts(10));
      setPage(1);
    } else {
      setLoadingMore(true);
      const newPosts = generateMockPosts(10, page * 10);
      setTimeout(() => {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 1500);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(generateMockPosts(10));
      setPage(1);
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    loadPosts(true);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userRow}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user.name}</Text>
      </View>
      <Text style={styles.questionText}>{item.question}</Text>
      <Text style={styles.contentText}>{item.content}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.action}>
          <Feather name="thumbs-up" size={20} color="#57606f" />
          <Text style={styles.actionText}>Upvote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="chatbubble-outline" size={20} color="#57606f" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="share-social-outline" size={20} color="#57606f" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
    
    
     {/* <FeedScreen/> */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
         ListHeaderComponent={<FeedScreen />} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (!loadingMore) loadPosts(false);
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ marginVertical: 10 }} /> : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Ask Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="question-answer" size={24} color="#fff" />
        <Text style={styles.fabText}>Ask</Text>
      </TouchableOpacity>
    
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingHorizontal: 1,
   
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2f3542',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1e272e',
  },
  contentText: {
    fontSize: 14,
    color: '#485460',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: '#dcdde3',
    paddingTop: 10,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#57606f',
  },
  fab: {
    position: 'absolute',
    bottom: 48,
    right: 20,
    backgroundColor: '#ff4757',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});
