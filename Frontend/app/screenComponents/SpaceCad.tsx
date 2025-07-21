// components/SpaceCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type Props = {
  id: string;
  name: string;
  image: string;
  members: number;
  joined: boolean;
  onToggleJoin: (id: string) => void;
};

export default function SpaceCard({ id, name, image, members, joined, onToggleJoin }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <Text style={styles.spaceName}>{name}</Text>
      <Text style={styles.members}>{members.toLocaleString()} members</Text>
      <TouchableOpacity
        style={[styles.joinButton, joined && styles.joined]}
        onPress={() => onToggleJoin(id)}
      >
        <Text style={[styles.joinText, joined && styles.joinedText]}>
          {joined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height:250,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  members: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  joined: {
    backgroundColor: '#e1f0ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  joinText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  joinedText: {
    color: '#007AFF',
  },
});
