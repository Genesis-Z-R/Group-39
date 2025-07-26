import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Header from '../../../screenComponents/Header';
import { useNavigation } from 'expo-router';

const dummyQuestion = {
  id: 'q1',
  title: 'What is the difference between React and React Native?'
};

const initialAnswers = [
  {
    id: 'a1',
    content:
      'React is a JavaScript library for building web interfaces. React Native is used to build mobile apps.',
    author: 'John Doe'
  },
  {
    id: 'a2',
    content: 'React Native uses native components while React uses DOM elements.',
    author: 'Jane Smith'
  }
];

const AnswerScreen = () => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!newAnswer.trim()) return;

    const answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: 'You'
    };

    setAnswers([answer, ...answers]);
    setNewAnswer('');
  };

  const renderAnswer = ({ item }: { item: any }) => (
    <View style={styles.answerCard}>
      <Text style={styles.answerAuthor}>{item.author}</Text>
      <Text style={styles.answerText}>{item.content}</Text>
    </View>
  );

  return (
    <>
      <Header title="Answer" navigation={navigation} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{dummyQuestion.title}</Text>
            </View>

            <FlatList
              data={answers}
              keyExtractor={(item) => item.id}
              renderItem={renderAnswer}
              contentContainerStyle={styles.answerList}
              ListHeaderComponent={<Text style={styles.answerHeader}>Answers</Text>}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Write your answer..."
                multiline
                value={newAnswer}
                onChangeText={setNewAnswer}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Post</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default AnswerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  questionBox: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f6fa'
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600'
  },
  answerList: {
    padding: 16,
    paddingBottom: 120
  },
  answerHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  answerCard: {
    marginBottom: 15,
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    padding: 12
  },
  answerAuthor: {
    fontWeight: '600',
    marginBottom: 4
  },
  answerText: {
    fontSize: 15
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10
  },
  input: {
    height: 80,
    borderColor: '#dcdde1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    textAlignVertical: 'top',
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 8
  },
  submitButton: {
    backgroundColor: '#1dd1a1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
