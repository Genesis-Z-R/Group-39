
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import Header from 'app/screenComponents/Header'
import { useNavigation } from 'expo-router'


// Dummy data for development
const DUMMY_DATA: FollowItem[] = [
  {
    id: 1,
    type: 'user',
    name: 'John Doe',
    description: 'Software Engineer and React Enthusiast',
  },
  {
    id: 2,
    type: 'topic',
    name: 'Artificial Intelligence',
    description: 'All things AI — ML, NLP, robotics and more',
  },
  {
    id: 3,
    type: 'space',
    name: 'Tech Talk Ghana',
    description: 'A community for Ghanaian tech minds',
  },
];

interface FollowItem {
  id: number;
  type: 'user' | 'topic' | 'space';
  name: string;
  description: string;
}

const Following = () => {
  const [followingList, setFollowingList] = useState<FollowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchFollowing = async () => {
    try {
      setLoading(true);

      // TODO: Replace this with your Spring Boot API call
      // Example:
      // const response = await fetch('http://<your-backend>/api/following?userId=1');
      // const data = await response.json();
      // setFollowingList(data);

      // Using dummy data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay
      setFollowingList(DUMMY_DATA);
    } catch (error) {
      console.error('Error fetching following list:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowing();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const renderItem = ({ item }: { item: FollowItem }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title = 'Following' navigation = {navigation}/>
    <View style={styles.container}>
      

      {loading ? (
        <ActivityIndicator size="large" color="#1dd1a1" />
      ) : (
        <FlatList
          data={followingList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
    </>
  );
};

export default Following;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#576574',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 5,
  },
});


