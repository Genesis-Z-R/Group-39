// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credentials?: string;
}

// Post Types
export interface Post {
  id: string;
  user: User;
  question: string;
  answer: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  upvotes: number;
  comments: number;
  shares: number;
  isUpvoted: boolean;
  createdAt: string;
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'follow' | 'mention';
  message: string;
  timestamp: string;
  isRead: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
} 