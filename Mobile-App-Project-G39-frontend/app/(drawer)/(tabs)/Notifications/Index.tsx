import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../screenComponents/Header'
import {useNavigation} from 'expo-router'

interface NotificationItem {
  id: number;
  type: 'answer' | 'comment' | 'follow' | 'mention' | 'upvote';
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Dummy Data
const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'answer',
    message: 'Someone answered your question about JavaScript.',
    timestamp: '2h ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'comment',
    message: 'John commented on your answer.',
    timestamp: '4h ago',
    isRead: true,
  },
  {
    id: 3,
    type: 'follow',
    message: 'Emily started following you.',
    timestamp: '1d ago',
    isRead: false,
  },
  {
    id: 4,
    type: 'mention',
    message: 'You were mentioned in a post.',
    timestamp: '3d ago',
    isRead: true,
  },
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.132.21.134:8081/api/notifications?userId=123');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, !item.isRead && styles.unreadCard]}>
      <Text style={[styles.message, !item.isRead && styles.unreadText]}>
        {item.message}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
<>
    <Header title = '' navigation={navigation}/>
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1dd1a1" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>You're all caught up!</Text>
          }
        />
      )}
    </View>
    </>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f1f2f6',
  },
  unreadCard: {
    backgroundColor: '#dff9fb',
  },
  message: {
    fontSize: 16,
    color: '#2f3542',
  },
  unreadText: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#636e72',
    marginTop: 5,
  },
  empty: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#b2bec3',
  },
});
