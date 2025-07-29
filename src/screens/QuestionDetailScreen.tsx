import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import UserAvatar from '../components/UserAvatar';
import ImageViewer from '../components/ImageViewer';
import { Question, Answer, Comment, User } from '../types';
import { getQuestionById, mockAnswers, mockComments, mockUsers } from '../services/mockData';

type QuestionDetailRouteProp = RouteProp<StackParamList, 'QuestionDetail'>;
type QuestionDetailNavigationProp = StackNavigationProp<StackParamList, 'QuestionDetail'>;



export default function QuestionDetailScreen() {
  const route = useRoute<QuestionDetailRouteProp>();
  const navigation = useNavigation<QuestionDetailNavigationProp>();
  const { questionId } = route.params;

  const [questionState, setQuestionState] = useState<Question>(() => {
    const foundQuestion = getQuestionById(questionId);
    if (foundQuestion) {
      return foundQuestion;
    }
    // Fallback question if not found
    return {
      id: questionId,
      title: 'Question not found',
      content: 'This question could not be loaded.',
      author: mockUsers[0],
      tags: [],
      answers: [],
      comments: [],
      upvotes: 0,
      downvotes: 0,
      views: 0,
      isAnswered: false,
      userVote: null as 'up' | 'down' | null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [newComment, setNewComment] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  
  // Refs for input focus management
  const commentInputRef = useRef<TextInput>(null);
  const answerInputRef = useRef<TextInput>(null);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleVote = (type: 'question' | 'answer', id: string, vote: 'up' | 'down') => {
    if (type === 'question') {
      setQuestionState(prev => {
        if (!prev) return prev;
        let newUpvotes = prev.upvotes;
        let newDownvotes = prev.downvotes;
                  let newUserVote: 'up' | 'down' | null = prev.userVote || null;
        if (vote === 'up') {
          if (prev.userVote === 'up') {
            newUpvotes -= 1;
            newUserVote = null;
          } else if (prev.userVote === 'down') {
            newUpvotes += 1;
            newDownvotes -= 1;
            newUserVote = 'up';
          } else {
            newUpvotes += 1;
            newUserVote = 'up';
          }
        } else if (vote === 'down') {
          if (prev.userVote === 'down') {
            newDownvotes -= 1;
            newUserVote = null;
          } else if (prev.userVote === 'up') {
            newDownvotes += 1;
            newUpvotes -= 1;
            newUserVote = 'down';
          } else {
            newDownvotes += 1;
            newUserVote = 'down';
          }
        }
        return {
          ...prev,
          upvotes: Math.max(0, newUpvotes),
          downvotes: Math.max(0, newDownvotes),
          userVote: newUserVote,
        };
      });
    } else {
      // Handle answer voting
      setAnswers(prev => prev.map(answer => {
        if (answer.id === id) {
          let newUpvotes = answer.upvotes;
          let newDownvotes = answer.downvotes;
          let newUserVote: 'up' | 'down' | null = answer.userVote || null;
          if (vote === 'up') {
            if (answer.userVote === 'up') {
              newUpvotes -= 1;
              newUserVote = null;
            } else if (answer.userVote === 'down') {
              newUpvotes += 1;
              newDownvotes -= 1;
              newUserVote = 'up';
            } else {
              newUpvotes += 1;
              newUserVote = 'up';
            }
          } else if (vote === 'down') {
            if (answer.userVote === 'down') {
              newDownvotes -= 1;
              newUserVote = null;
            } else if (answer.userVote === 'up') {
              newDownvotes += 1;
              newUpvotes -= 1;
              newUserVote = 'down';
            } else {
              newDownvotes += 1;
              newUserVote = 'down';
            }
          }
          return {
            ...answer,
            upvotes: Math.max(0, newUpvotes),
            downvotes: Math.max(0, newDownvotes),
            userVote: newUserVote,
          };
        }
        return answer;
      }));
    }
  };

  const handleAddComment = (parentId: string, parentType: 'question' | 'answer') => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: mockUsers[0],
      parentId,
      parentType,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    };

    if (parentType === 'question') {
      // Add to question comments
      Alert.alert('Comment added', 'Your comment has been posted');
    } else {
      // Add to answer comments
      setAnswers(prev => prev.map(answer => {
        if (answer.id === parentId) {
          return {
            ...answer,
            comments: [...answer.comments, comment],
          };
        }
        return answer;
      }));
    }

    setNewComment('');
    setShowCommentInput(null);
    console.log('Comment added, input cleared');
  };

  const handleAddAnswer = () => {
    if (!newAnswer.trim()) return;

    const answer: Answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: mockUsers[0],
      questionId: questionState.id,
      comments: [],
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      userVote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAnswers(prev => [answer, ...prev]);
    setNewAnswer('');
    setShowAnswerInput(false);
    Alert.alert('Answer posted', 'Your answer has been posted successfully!');
  };

  const VoteButtons = ({ 
    upvotes, 
    downvotes, 
    userVote, 
    onVote, 
    size = 'medium' 
  }: {
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null | undefined;
    onVote: (vote: 'up' | 'down') => void;
    size?: 'small' | 'medium';
  }) => {
    const iconSize = size === 'small' ? 16 : 20;
    const textSize = size === 'small' ? 12 : 14;

    return (
      <View style={styles.voteContainer}>
        <TouchableOpacity
          style={[styles.voteButton, userVote === 'up' && styles.voteButtonActive]}
          onPress={() => onVote('up')}
        >
          <Ionicons 
            name={userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'} 
            size={iconSize} 
            color={userVote === 'up' ? '#1a73e8' : '#666'} 
          />
        </TouchableOpacity>
        <Text style={[styles.voteCount, { fontSize: textSize }]}>
          {formatNumber(upvotes - downvotes)}
        </Text>
        <TouchableOpacity
          style={[styles.voteButton, userVote === 'down' && styles.voteButtonActive]}
          onPress={() => onVote('down')}
        >
          <Ionicons 
            name={userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'} 
            size={iconSize} 
            color={userVote === 'down' ? '#1a73e8' : '#666'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  const CommentSection = ({ 
    comments, 
    parentId, 
    parentType 
  }: {
    comments: Comment[];
    parentId: string;
    parentType: 'question' | 'answer';
  }) => {
    // Create a unique ref for each comment section
    const inputRef = useRef<TextInput>(null);
    
    return (
      <View style={styles.commentSection}>
        {comments.map(comment => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <UserAvatar
                size={24}
                username={comment.author.username}
                avatar={comment.author.avatar}
                isVerified={comment.author.isVerified}
              />
              <Text style={styles.commentAuthor}>{comment.author.username}</Text>
              <Text style={styles.commentTime}>{formatDate(comment.createdAt)}</Text>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.commentAction}>
                <Ionicons name="arrow-up-outline" size={14} color="#666" />
                <Text style={styles.commentActionText}>{comment.upvotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentAction}>
                <Ionicons name="arrow-down-outline" size={14} color="#666" />
                <Text style={styles.commentActionText}>{comment.downvotes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {showCommentInput === parentId ? (
          <View style={styles.commentInputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
              textAlignVertical="top"
              autoFocus={true}
              blurOnSubmit={false}
              returnKeyType="default"
              // onBlur removed to keep keyboard active
            />
            <View style={styles.commentInputActions}>
              <TouchableOpacity
                style={styles.commentInputButton}
                onPress={() => {
                  setShowCommentInput(null);
                  setNewComment('');
                  inputRef.current?.blur();
                }}
              >
                <Text style={styles.commentInputButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.commentInputButton, styles.commentInputButtonPrimary]}
                onPress={() => handleAddComment(parentId, parentType)}
              >
                <Text style={styles.commentInputButtonTextPrimary}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => {
              setShowCommentInput(parentId);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#1a73e8" />
            <Text style={styles.addCommentText}>Add a comment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        enabled={true}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ flexGrow: 1 }}
          nestedScrollEnabled={true}
        >
        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{questionState.title}</Text>
            <View style={styles.questionMeta}>
              <Text style={styles.questionViews}>{formatNumber(questionState.views)} views</Text>
              <Text style={styles.questionTime}>{formatDate(questionState.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.questionContent}>
            <VoteButtons
              upvotes={questionState.upvotes}
              downvotes={questionState.downvotes}
              userVote={questionState.userVote}
              onVote={(vote) => handleVote('question', questionState.id, vote)}
            />
            <View style={styles.questionTextContainer}>
              <Text style={styles.questionText}>{questionState.content}</Text>
              
              {questionState.images && questionState.images.length > 0 && (
                <ImageViewer images={questionState.images} />
              )}
              
              <View style={styles.questionAuthor}>
                <UserAvatar
                  size={32}
                  username={questionState.author.username}
                  avatar={questionState.author.avatar}
                  isVerified={questionState.author.isVerified}
                />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{questionState.author.username}</Text>
                  <Text style={styles.authorReputation}>
                    {formatNumber(questionState.author.reputation)} reputation
                  </Text>
                </View>
              </View>

              <View style={styles.questionTags}>
                {questionState.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <CommentSection
            comments={questionState.comments}
            parentId={questionState.id}
            parentType="question"
          />
        </View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          <View style={styles.answersHeader}>
            <Text style={styles.answersTitle}>
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </Text>
                    <TouchableOpacity
          style={styles.addAnswerButton}
          onPress={() => {
            setShowAnswerInput(true);
            // Focus the input after a short delay to ensure the component is rendered
            setTimeout(() => {
              answerInputRef.current?.focus();
            }, 100);
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#1a73e8" />
          <Text style={styles.addAnswerText}>Add Answer</Text>
        </TouchableOpacity>
          </View>

          {answers.map(answer => (
            <View key={answer.id} style={[styles.answer, answer.isAccepted && styles.acceptedAnswer]}>
              <View style={styles.answerContent}>
                <VoteButtons
                  upvotes={answer.upvotes}
                  downvotes={answer.downvotes}
                  userVote={answer.userVote}
                  onVote={(vote) => handleVote('answer', answer.id, vote)}
                />
                <View style={styles.answerTextContainer}>
                  {answer.isAccepted && (
                    <View style={styles.acceptedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                      <Text style={styles.acceptedText}>Accepted</Text>
                    </View>
                  )}
                  <Text style={styles.answerText}>{answer.content}</Text>
                  
                  {answer.images && answer.images.length > 0 && (
                    <ImageViewer images={answer.images} />
                  )}
                  
                  <View style={styles.answerAuthor}>
                    <UserAvatar
                      size={32}
                      username={answer.author.username}
                      avatar={answer.author.avatar}
                      isVerified={answer.author.isVerified}
                    />
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>{answer.author.username}</Text>
                      <Text style={styles.authorReputation}>
                        {formatNumber(answer.author.reputation)} reputation
                      </Text>
                    </View>
                    <Text style={styles.answerTime}>{formatDate(answer.createdAt)}</Text>
                  </View>
                </View>
              </View>

              <CommentSection
                comments={answer.comments}
                parentId={answer.id}
                parentType="answer"
              />
            </View>
          ))}
        </View>

        {/* Add Answer Input */}
        {showAnswerInput && (
          <View style={styles.answerInputContainer}>
            <Text style={styles.answerInputTitle}>Your Answer</Text>
            <TextInput
              ref={answerInputRef}
              style={styles.answerInput}
              placeholder="Write your answer here..."
              value={newAnswer}
              onChangeText={setNewAnswer}
              multiline
              textAlignVertical="top"
              autoFocus={true}
              blurOnSubmit={false}
              returnKeyType="default"
            />
            <View style={styles.answerInputActions}>
              <TouchableOpacity
                style={styles.answerInputButton}
                onPress={() => {
                  setShowAnswerInput(false);
                  setNewAnswer('');
                  answerInputRef.current?.blur();
                }}
              >
                <Text style={styles.answerInputButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.answerInputButton, styles.answerInputButtonPrimary]}
                onPress={handleAddAnswer}
              >
                <Text style={styles.answerInputButtonTextPrimary}>Post Answer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  questionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 28,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionViews: {
    fontSize: 14,
    color: '#666',
  },
  questionTime: {
    fontSize: 14,
    color: '#666',
  },
  questionContent: {
    flexDirection: 'row',
    padding: 16,
  },
  voteContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  voteButton: {
    padding: 8,
    borderRadius: 4,
  },
  voteButtonActive: {
    backgroundColor: '#f0f8ff',
  },
  voteCount: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginVertical: 4,
  },
  questionTextContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 16,
  },
  questionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    marginLeft: 8,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  authorReputation: {
    fontSize: 12,
    color: '#666',
  },
  questionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  commentSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  comment: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
    flex: 1,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addCommentText: {
    fontSize: 14,
    color: '#1a73e8',
    marginLeft: 4,
  },
  commentInputContainer: {
    marginTop: 8,
  },
  commentInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  commentInputButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  commentInputButtonPrimary: {
    backgroundColor: '#1a73e8',
  },
  commentInputButtonText: {
    fontSize: 14,
    color: '#666',
  },
  commentInputButtonTextPrimary: {
    fontSize: 14,
    color: '#ffffff',
  },
  answersContainer: {
    backgroundColor: '#ffffff',
  },
  answersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  addAnswerText: {
    fontSize: 14,
    color: '#1a73e8',
    marginLeft: 4,
  },
  answer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  acceptedAnswer: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  answerContent: {
    flexDirection: 'row',
  },
  answerTextContainer: {
    flex: 1,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  acceptedText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
    marginLeft: 4,
  },
  answerText: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 16,
  },
  answerAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
  answerInputContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 16,
  },
  answerInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  answerInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  answerInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  answerInputButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  answerInputButtonPrimary: {
    backgroundColor: '#1a73e8',
  },
  answerInputButtonText: {
    fontSize: 14,
    color: '#666',
  },
  answerInputButtonTextPrimary: {
    fontSize: 14,
    color: '#ffffff',
  },
}); 