import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { Post } from '../../src/types/post';
import { apiRequest } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';
import PostItem from './PostItem';

const Mockfeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  const loadPosts = useCallback(async (isRefresh: boolean = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoadingMore(true);
    try {
      const data = await apiRequest('/posts', { method: 'GET' }, token);
      // Transform data to match Post[] interface if needed
      const backendPosts: Post[] = data.map((item: any) => ({
        id: item.id.toString(),
        user: {
          id: item.user.id,
          name: item.user.name,
          avatar: item.user.avatar,
          credentials: item.user.credentials
        },
        question: item.question,
        answer: item.answer,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        upvotes: item.upvotes,
        comments: item.comments,
        shares: item.shares,
        isUpvoted: item.isUpvoted,
        createdAt: item.createdAt
      }));
      if (isRefresh) {
        setPosts(backendPosts);
        setRefreshing(false);
      } else {
        setPosts(prev => [...prev, ...backendPosts]);
        setLoadingMore(false);
      }
    } catch (error) {
      console.warn('API fetch failed:', error);
      // Optionally show a user-friendly error message
      if (isRefresh) {
        setPosts([]);
        setRefreshing(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [token]);

  const handleRefresh = useCallback(async () => {
    await loadPosts(true);
  }, [loadPosts]);

  const handleLoadMore = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem key={item.id} post={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default Mockfeed; 