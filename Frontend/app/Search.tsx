import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const DUMMY_SUGGESTIONS = [
  'React Native',
  'Expo Router',
  'Firebase Auth',
  'Data Flow Diagrams',
  'System Analysis',
];

const DUMMY_RESULTS = [
  { id: '1', title: 'How to use Expo Router in React Native?' },
  { id: '2', title: 'Benefits of Firebase Authentication' },
  { id: '3', title: 'What is a Data Flow Diagram?' },
  { id: '4', title: 'How to filter content in a mobile app?' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState(DUMMY_RESULTS);

  // Load search history
  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem('search_history');
      if (stored) setHistory(JSON.parse(stored));
    };
    loadHistory();
  }, []);

  // Save to history
  const handleSearch = async (text: string) => {
    if (!text) return;
    const newHistory = [text, ...history.filter(item => item !== text)];
    setHistory(newHistory);
    await AsyncStorage.setItem('search_history', JSON.stringify(newHistory));

    // 👉 Replace this with real API call
    const results = DUMMY_RESULTS.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(results);
    Keyboard.dismiss();
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('search_history');
  };

  const handleFilter = (type: string) => {
    // 🧠 Add real filtering logic here
    const filtered = DUMMY_RESULTS.filter(item =>
      item.title.toLowerCase().includes(type.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search questions, topics..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialIcons name="clear" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Options */}
      <View style={styles.filters}>
        {['All', 'Recent', 'Popular'].map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => handleFilter(filter)}
            style={styles.filterChip}
          >
            <Text>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Suggestions */}
      {query.length === 0 && (
        <>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <FlatList
            data={DUMMY_SUGGESTIONS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSearch(item)}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* History */}
      {history.length > 0 && query.length === 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {history.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
              <Text style={styles.historyItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {query.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Results</Text>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultCard}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{ margin: 10 }}>No results found.</Text>}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 60
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
  },
  filters: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#dcdde1',
    borderRadius: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 16,
  },
  suggestion: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f1f2f6',
    borderRadius: 6,
    marginBottom: 6,
  },
  historySection: {
    marginTop: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f1f2f6',
    borderRadius: 6,
    marginTop: 6,
  },
  clearText: {
    color: '#ff4757',
    fontSize: 13,
  },
  resultCard: {
    padding: 12,
    backgroundColor: '#eeeff4ff',
    borderRadius: 8,
    marginBottom: 8,
  },
});
