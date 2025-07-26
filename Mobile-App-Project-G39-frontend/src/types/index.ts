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

// PostDetail API Types
export interface PostDetailResponse {
  id: number;
  user: UserInfo;
  question: string;
  answer: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  upvotes: number;
  shares: number;
  commentsCount: number;
  createdAt: string;
  isUpvoted: boolean;
  isBookmarked: boolean;
  comments: CommentInfo[];
  factCheck?: FactCheckInfo;
  shareStats: ShareStats;
  stats: PostStats;
}

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
  credentials?: string;
  isFollowing: boolean;
}

export interface CommentInfo {
  id: number;
  user: UserInfo;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface FactCheckInfo {
  id: number;
  validityStatus: string;
  accuracyScore?: number;
  confidenceLevel?: string;
  checkedBy: string;
  checkedAt: string;
  summary?: string;
}

export interface ShareStats {
  totalShares: number;
  shareTypeBreakdown: ShareTypeCount[];
  platformBreakdown: PlatformCount[];
}

export interface ShareTypeCount {
  shareType: string;
  count: number;
}

export interface PlatformCount {
  platform: string;
  count: number;
}

export interface PostStats {
  viewCount: number;
  uniqueViewers: number;
  engagementRate: number;
  lastViewed: string;
}

// UserProfile API Types
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  credentials?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

export interface UserPost {
  id: string;
  question: string;
  answer: string;
  upvotes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export interface UserFollower {
  id: string;
  name: string;
  avatar: string;
  credentials?: string;
  isFollowing: boolean;
  followedAt: string;
} 