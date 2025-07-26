import { config } from '../config/config';

const BASE_URL = config.api.baseUrl;

export async function apiRequest(path: string, options: RequestInit = {}, token?: string) {
  try {
    const headers: Record<string, string> = Object.assign({}, options.headers as Record<string, string> || {}, {
      'Content-Type': 'application/json',
    });
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    
    if (!res.ok) {
      let errorMsg = `API error: ${res.status}`;
      try {
        const err = await res.json();
        errorMsg = err.message || errorMsg;
      } catch {
        // If JSON parsing fails, use status text
        errorMsg = res.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
    
    // Handle empty responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      return res.text();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Network error occurred');
    }
  }
}

// Example: Fetch all posts
export async function fetchPosts(token: string) {
  return apiRequest('/posts', {}, token);
}

// Example: Create a post
export async function createPost(post: any, token: string) {
  return apiRequest('/posts', { method: 'POST', body: JSON.stringify(post) }, token);
}

// Example: Fetch all users
export async function fetchUsers(token: string) {
  return apiRequest('/users', {}, token);
}

export async function followUser(userId: string, token: string, followerId: string) {
  return apiRequest(`/users/${userId}/follow`, {
    method: 'POST',
    headers: { 'X-User-Id': followerId },
  }, token);
}

export async function sharePost(postId: string, token: string, shareData?: {
  shareType: string;
  platform: string;
  userAgent?: string;
}) {
  const body = shareData ? JSON.stringify(shareData) : undefined;
  return apiRequest(`/posts/${postId}/share`, { 
    method: 'POST',
    body
  }, token);
}

export async function getPostShares(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/shares`, {}, token);
}

export async function getShareStats(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/shares/stats`, {}, token);
}

export async function upvotePost(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/upvote`, { method: 'POST' }, token);
}

export async function fetchComments(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/comments`, {}, token);
}

export async function addComment(postId: string, content: string, token: string) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }, token);
}

export async function syncUserWithBackend(token: string) {
  // This will create the user in the backend if not present
  return apiRequest('/users/firebase', { method: 'POST' }, token);
}

// Fact-Checking API Functions
export async function performFactCheck(postId: string, token: string, checkedBy: string = 'user') {
  return apiRequest(`/posts/${postId}/fact-check?checkedBy=${checkedBy}`, { method: 'POST' }, token);
}

export async function getLatestFactCheck(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/fact-check`, {}, token);
}

export async function getFactCheckHistory(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/fact-check/history`, {}, token);
}

export async function getFactCheckStatus(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/fact-check/status`, {}, token);
}

// PostDetail API Functions
export async function fetchPostDetail(postId: string, userId?: string, token?: string) {
  const url = `/posts/${postId}/detail${userId ? `?userId=${userId}` : ''}`;
  return apiRequest(url, {}, token);
}

export async function trackPostView(postId: string, token?: string) {
  try {
    return await apiRequest(`/posts/${postId}/view`, { method: 'POST' }, token);
  } catch (error) {
    console.warn('Failed to track post view:', error);
    return null;
  }
}

export async function fetchCommentsPaginated(
  postId: string, 
  page: number = 0, 
  size: number = 10, 
  token?: string
) {
  return apiRequest(`/posts/${postId}/comments/paginated?page=${page}&size=${size}`, {}, token);
}

// UserProfile API Functions
export async function fetchUserProfile(userId: string, token?: string) {
  return apiRequest(`/users/${userId}/profile`, {}, token);
}

export async function fetchUserPosts(userId: string, page: number = 0, size: number = 10, token?: string) {
  return apiRequest(`/users/${userId}/posts?page=${page}&size=${size}`, {}, token);
}

export async function followUserProfile(userId: string, token: string, followerId: string) {
  return apiRequest(`/users/${userId}/follow`, {
    method: 'POST',
    headers: { 'X-User-Id': followerId },
  }, token);
}

export async function unfollowUserProfile(userId: string, token: string, followerId: string) {
  return apiRequest(`/users/${userId}/unfollow`, {
    method: 'DELETE',
    headers: { 'X-User-Id': followerId },
  }, token);
}

export async function getUserFollowers(userId: string, page: number = 0, size: number = 20, token?: string) {
  return apiRequest(`/users/${userId}/followers?page=${page}&size=${size}`, {}, token);
}

export async function getUserFollowing(userId: string, page: number = 0, size: number = 20, token?: string) {
  return apiRequest(`/users/${userId}/following?page=${page}&size=${size}`, {}, token);
}

// Add more endpoints as needed... 