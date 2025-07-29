import { config } from '../config/config';

// Base API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  const url = `${config.api.baseUrl}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// Share functionality
export async function sharePost(
  postId: string,
  token: string,
  shareData?: {
    shareType: string;
    platform: string;
    userAgent?: string;
  }
) {
  const body = shareData ? JSON.stringify(shareData) : undefined;
  return apiRequest(`/posts/${postId}/share`, {
    method: 'POST',
    body,
  }, token);
}

export async function getShareStats(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/shares/stats`, {}, token);
}

export async function getPostShares(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/shares`, {}, token);
}

// Question/Post related API calls
export async function getQuestions(token?: string) {
  return apiRequest('/posts', {}, token);
}

export async function getQuestionById(questionId: string, token?: string) {
  return apiRequest(`/posts/${questionId}`, {}, token);
}

export async function createQuestion(questionData: any, token: string) {
  return apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(questionData),
  }, token);
}

export async function updateQuestion(questionId: string, questionData: any, token: string) {
  return apiRequest(`/posts/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(questionData),
  }, token);
}

export async function deleteQuestion(questionId: string, token: string) {
  return apiRequest(`/posts/${questionId}`, {
    method: 'DELETE',
  }, token);
}

// User related API calls
export async function getUserProfile(userId: string, token?: string) {
  return apiRequest(`/users/${userId}`, {}, token);
}

export async function updateUserProfile(userId: string, userData: any, token: string) {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, token);
}

// Comments API calls
export async function getComments(postId: string, token?: string) {
  return apiRequest(`/posts/${postId}/comments`, {}, token);
}

export async function createComment(postId: string, commentData: any, token: string) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  }, token);
}

// Search API calls
export async function searchContent(query: string, token?: string) {
  return apiRequest(`/search?q=${encodeURIComponent(query)}`, {}, token);
}

// Fact Check API calls
export async function factCheckPost(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/fact-check`, {
    method: 'POST',
  }, token);
}

export async function getFactCheckResult(postId: string, token: string) {
  return apiRequest(`/posts/${postId}/fact-check`, {}, token);
} 