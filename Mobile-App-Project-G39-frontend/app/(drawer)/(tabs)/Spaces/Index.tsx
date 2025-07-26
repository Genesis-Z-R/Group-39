import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Header from '../../../screenComponents/Header'
import {useNavigation} from 'expo-router'


// Dummy community data
const dummyCommunities = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Discuss frontend, backend, and full stack web dev.',
    isJoined: true
  },
  {
    id: '2',
    name: 'AI & Machine Learning',
    description: 'All about artificial intelligence and ML.',
    isJoined: false
  },
  {
    id: '3',
    name: 'Mobile App Builders',
    description: 'React Native, Flutter, and mobile app dev topics.',
    isJoined: false
  },
  {
    id: '4',
    name: 'Productivity & Tech',
    description: 'Productivity tools, workflows, and systems.',
    isJoined: true
  }
];

const CommunityScreen = () => {
  const [communities, setCommunities] = useState(dummyCommunities);
  const navigation = useNavigation()

  const toggleJoin = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isJoined: !c.isJoined } : c
      )
    );
  };

  const renderCommunity = ({ item }: { item: typeof dummyCommunities[0] }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity
        onPress={() => toggleJoin(item.id)}
        style={[
          styles.button,
          item.isJoined ? styles.leaveBtn : styles.joinBtn
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            item.isJoined ? styles.leaveText : styles.joinText
          ]}
        >
          {item.isJoined ? 'Leave' : 'Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const joined = communities.filter((c) => c.isJoined);
  const recommended = communities.filter((c) => !c.isJoined);

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Spaces' navigation={navigation}/>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Explore Spaces</Text>
            {joined.length === 0 ? (
              <Text style={styles.emptyText}>You haven’t joined any communities yet.</Text>
            ) : (
              joined.map((item) => renderCommunity({ item }))
            )}

            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
              Recommended
            </Text>
          </>
        }
        data={recommended}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunity}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  description: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 10
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  joinBtn: {
    backgroundColor: '#1dd1a1'
  },
  leaveBtn: {
    backgroundColor: '#dfe6e9'
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14
  },
  joinText: {
    color: '#fff'
  },
  leaveText: {
    color: '#2d3436'
  }
});
