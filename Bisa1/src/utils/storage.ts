import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers, mockQuestions, mockAnswers, mockComments } from '../services/mockData';

// --- USERS ---
export const getUsers = async () => {
  const users = await AsyncStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = async (users: any[]) => {
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const saveCurrentUser = async (user: any) => {
  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
};

export const removeCurrentUser = async () => {
  await AsyncStorage.removeItem('currentUser');
};

// --- QUESTIONS ---
export const getQuestions = async () => {
  const questions = await AsyncStorage.getItem('questions');
  return questions ? JSON.parse(questions) : [];
};

export const saveQuestions = async (questions: any[]) => {
  await AsyncStorage.setItem('questions', JSON.stringify(questions));
};

// --- ANSWERS ---
export const getAnswers = async () => {
  const answers = await AsyncStorage.getItem('answers');
  return answers ? JSON.parse(answers) : [];
};

export const saveAnswers = async (answers: any[]) => {
  await AsyncStorage.setItem('answers', JSON.stringify(answers));
};

// --- COMMENTS ---
export const getComments = async () => {
  const comments = await AsyncStorage.getItem('comments');
  return comments ? JSON.parse(comments) : [];
};

export const saveComments = async (comments: any[]) => {
  await AsyncStorage.setItem('comments', JSON.stringify(comments));
};

export const seedAllMockData = async () => {
  const users = await AsyncStorage.getItem('users');
  const questions = await AsyncStorage.getItem('questions');
  const answers = await AsyncStorage.getItem('answers');
  const comments = await AsyncStorage.getItem('comments');
  if (!users) await saveUsers(mockUsers);
  if (!questions) await saveQuestions(mockQuestions);
  if (!answers) await saveAnswers(mockAnswers);
  if (!comments) await saveComments(mockComments);
}; 