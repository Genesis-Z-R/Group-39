// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform
// } from 'react-native';
// import { useNavigation } from 'expo-router';

// export default function CreateModal() {
//   const navigation = useNavigation();
//   const [question, setQuestion] = useState('');
//   const [post, setPost] = useState('');

//   const handleSubmit = () => {
//     console.log('Submitting:', { question, post });

//     // 🔌 TODO: integrate real API call here
//     // await api.create({ question, post });

//     // Close modal
//     navigation.goBack();
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.overlay}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View style={styles.modalContainer}>
//         <Text style={styles.title}>Create Something</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Ask a question..."
//           value={question}
//           onChangeText={setQuestion}
//         />

//         <TextInput
//           style={[styles.input, { height: 100 }]}
//           placeholder="Write a post..."
//           multiline
//           value={post}
//           onChangeText={setPost}
//         />

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitText}>Submit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.4)'
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 10,
//     height:'95%'
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 16,
//     marginBottom: 12
//   },
//   submitButton: {
//     backgroundColor: '#1dd1a1',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   submitText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   cancelText: {
//     textAlign: 'center',
//     color: '#555',
//     marginTop: 5
//   }
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
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

  const renderScene = SceneMap({
    question: () => (
      <AddQuestionRoute question={question} setQuestion={setQuestion} />
    ),
    post: () => <CreatePostRoute post={post} setPost={setPost} />
  });

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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
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
  submitButton: {
    backgroundColor: '#1dd1a1',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '90%',
    left: 35,
    borderRadius: 30,
    width: '80%',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
