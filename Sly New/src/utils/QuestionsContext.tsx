import React, { createContext, useContext, useState } from 'react';
import { mockQuestions } from '../services/mockData';
import { Question } from '../types';
import { getQuestions, saveQuestions, seedAllMockData } from './storage';
import { useEffect } from 'react';

interface QuestionsContextType {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  addQuestion: (question: Partial<Question>) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) throw new Error('useQuestions must be used within a QuestionsProvider');
  return context;
};

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  useEffect(() => {
    (async () => {
      await seedAllMockData();
      const loadedQuestions = await getQuestions();
      setQuestions(loadedQuestions.length ? loadedQuestions : mockQuestions);
    })();
  }, []);

  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  const addQuestion = (question: Partial<Question>) => {
    const newQ: Question = {
      id: Date.now().toString(),
      title: question.title || '',
      content: question.content || '',
      tags: question.tags || [],
      images: question.images || [],
      author: question.author || mockQuestions[0].author,
      upvotes: 0,
      downvotes: 0,
      views: 0,
      isAnswered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [],
      comments: [],
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions, addQuestion }}>
      {children}
    </QuestionsContext.Provider>
  );
}; 