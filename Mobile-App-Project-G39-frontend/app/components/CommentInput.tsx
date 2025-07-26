import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet , Modal} from 'react-native';
import { addComment } from '../../src/services/api';
import { useAuth } from '../../src/context/authContext';

interface CommentInputProps {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, onCommentAdded }) => {
  const { token } = useAuth();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addComment(postId, comment, token);
      setComment('');
      if (onCommentAdded) onCommentAdded();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment..."
        multiline={true}
        style={styles.input}
        editable={!loading}
      />
      <Button title="Post" onPress={handleAddComment} disabled={loading || !comment.trim()} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
});

export default CommentInput; 