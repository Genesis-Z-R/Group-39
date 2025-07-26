import { useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { apiRequest } from '../../../src/services/api';
import { useAuth } from '../../../src/context/authContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/notifications?userId=123', { method: 'GET' }, token);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <Text>Loading notifications...</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.notificationItem}>
              <Text>{item.message}</Text>
              <Text>{item.timestamp}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default Notifications; 