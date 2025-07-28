import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import FeedScreen from './FeedScreen';
import { useAuth } from '../../src/context/authContext';
import { fetchPosts } from '../../src/services/api';

export default function Feed() {
  const { token, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchPosts(token);
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!authLoading && token) {
      loadPosts();
    }
  }, [authLoading, token, loadPosts]);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userRow}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user.name}</Text>
      </View>
      <Text style={styles.questionText}>{item.question}</Text>
      <Text style={styles.contentText}>{item.answer || item.content}</Text>
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

  if (authLoading || loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#ff4757" />;
  }
  if (error) {
    return (
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity onPress={loadPosts} style={{ marginTop: 10 }}>
          <Text style={{ color: '#007AFF' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<FeedScreen />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
