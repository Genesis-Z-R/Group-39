import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
   Platform 
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from 'expo-router';

const initialLayout = { width: Dimensions.get('window').width };

const AddQuestionRoute = ({
  question,
  setQuestion
}: {
  question: string;
  setQuestion: (text: string) => void;
}) => (
  <View style={styles.scene}>
    <Text style={styles.label}>Ask a Question</Text>
    <TextInput
      style={styles.input}
      placeholder="What's your question?"
      value={question}
      onChangeText={setQuestion}
      multiline
    />
  </View>
);

const CreatePostRoute = ({
  post,
  setPost
}: {
  post: string;
  setPost: (text: string) => void;
}) => (
  <View style={styles.scene}>
    <Text style={styles.label}>Create a Post</Text>
    <TextInput
      style={styles.input}
      placeholder="Share your thoughts..."
      value={post}
      onChangeText={setPost}
      multiline
    />
  </View>
);

const CreateModal = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [post, setPost] = useState('');

  const [routes] = useState([
    { key: 'question', title: 'Add Question' },
    { key: 'post', title: 'Create Post' }
  ]);

// Removed the sceneMap component
  const renderScene =  ({ route }: { route: { key: string } }) => {
  switch (route.key) {
    case 'question':
      return <AddQuestionRoute question={question} setQuestion={setQuestion} />;
    case 'post':
      return <CreatePostRoute post={post} setPost={setPost} />;
    default:
      return null;
  }
};

  const handleSubmit = async () => {
    const data = {
      question: question.trim(),
      post: post.trim()
    };

    // ✅ Simulate API call (replace with real one)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Submitted:', data);

    navigation.goBack(); // Close modal
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#1dd1a1' }}
            style={{ backgroundColor: '#f5f6fa' }}
            labelStyle={{ color: 'black', fontWeight: '600' }}
          />
        )}
      />
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.floatingContainer}
    >
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateModal;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f1f2f6'
  },

  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingContainer: {
  position: 'absolute',
  bottom: 20,
  left: 0,
  right: 0,
  alignItems: 'center',
},

submitButton: {
  backgroundColor: '#1dd1a1',
  paddingVertical: 16,
  paddingHorizontal: 32,
  borderRadius: 30,
  width: '80%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom:'90%'
},

});
