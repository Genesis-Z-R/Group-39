import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from 'react-native';

// Simulated data
const dummyPosts = [
  { id: '1', content: 'React Native or Flutter?', author: 'Alice' },
  { id: '2', content: 'What’s your favorite tech stack?', author: 'Bob' },
  { id: '3', content: 'Best tools for productivity?', author: 'Chloe' }
];

const CommunityDetailScreen = () => {
  const { id } = useLocalSearchParams(); // ID from route param
  const router = useRouter();
  const [joined, setJoined] = useState(true); // simulate joined state

  const community = {
    id,
    name: 'Community ' + id,
    description: 'This is a placeholder description for community #' + id
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{community.name}</Text>
      <Text style={styles.description}>{community.description}</Text>

      <TouchableOpacity
        style={[styles.joinBtn, joined ? styles.leave : styles.join]}
        onPress={() => setJoined(!joined)}
      >
        <Text style={joined ? styles.leaveText : styles.joinText}>
          {joined ? 'Leave' : 'Join'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postAuthor}>{item.author}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default CommunityDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  description: {
    color: '#636e72',
    marginBottom: 10
  },
  joinBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  join: {
    backgroundColor: '#1dd1a1'
  },
  leave: {
    backgroundColor: '#dfe6e9'
  },
  joinText: {
    color: '#fff',
    fontWeight: '600'
  },
  leaveText: {
    color: '#2d3436',
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  },
  postCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f2f6',
    marginBottom: 10
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});
