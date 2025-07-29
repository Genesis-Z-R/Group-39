export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  reputation: number;
  followers: number;
  following: number;
  isVerified: boolean;
  createdAt: Date;
  password?: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  answers: Answer[];
  comments: Comment[];
  images?: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  shares: number;
  isAnswered: boolean;
  userVote?: 'up' | 'down' | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  questionId: string;
  comments: Comment[];
  images?: string[];
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  userVote?: 'up' | 'down' | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  parentId: string; // question or answer id
  parentType: 'question' | 'answer';
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  followers: number;
}

export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'upvote' | 'follow' | 'mention';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // question, answer, or user id
}

export interface SearchResult {
  questions: Question[];
  users: User[];
  tags: Tag[];
}

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Ask: undefined;
  Notifications: undefined;
  Profile: { userId?: string };
};

export type StackParamList = {
  MainTabs: undefined;
  QuestionDetail: { questionId: string };
  UserProfile: { userId: string };
  AskQuestion: undefined;
  EditQuestion: { questionId: string };
  EditAnswer: { answerId: string };
  TagQuestions: { tagName: string };
  Settings: undefined;
  EditProfile: { user: User };
  PrivacySettings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ReportBug: undefined;
  HelpSupport: undefined;
  AboutBisa: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  EditProfile: { user: User };
  Settings: undefined;
  HelpSupport: undefined;
  AboutBisa: undefined;
  PrivacySettings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ReportBug: undefined;
}; 