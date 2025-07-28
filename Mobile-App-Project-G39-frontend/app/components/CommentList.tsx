import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchComments } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { token } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments(postId, token).then(setComments).finally(() => setLoading(false));
  }, [postId, token]);

  if (loading) return <ActivityIndicator />;
  if (!comments.length) return <Text style={{ textAlign: 'center', color: '#888' }}>No comments yet.</Text>;

  return (
    <FlatList
      data={comments}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.user?.name || 'User'}:</Text>
          <Text>{item.content}</Text>
        </View>
      )}
    />
  );
};

export default CommentList; 