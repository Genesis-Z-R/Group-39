# 🔗 Frontend-Backend Integration Guide

## 🎯 Overview

This guide explains how to integrate the frontend PostDetail functionality with the backend API endpoints. The integration enables real data fetching, view tracking, and interactive features.

## 📱 Frontend Implementation

### 1. **API Service Integration**

Create or update your API service to include PostDetail endpoints:

```typescript
// src/services/api.ts
export const fetchPostDetail = async (postId: string, userId?: string, token?: string) => {
  const url = `${config.api.baseUrl}/posts/${postId}/detail${userId ? `?userId=${userId}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch post detail: ${response.status}`);
  }
  
  return response.json();
};

export const trackPostView = async (postId: string, token?: string) => {
  const response = await fetch(`${config.api.baseUrl}/posts/${postId}/view`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    console.warn('Failed to track post view:', response.status);
  }
  
  return response.json();
};

export const fetchCommentsPaginated = async (
  postId: string, 
  page: number = 0, 
  size: number = 10, 
  token?: string
) => {
  const response = await fetch(
    `${config.api.baseUrl}/posts/${postId}/comments/paginated?page=${page}&size=${size}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.status}`);
  }
  
  return response.json();
};
```

### 2. **Update PostDetail Component**

Modify your PostDetail component to use real API data:

```typescript
// app/PostDetail.tsx
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/authContext';
import { fetchPostDetail, trackPostView, fetchCommentsPaginated } from '../../src/services/api';

const PostDetail: React.FC = () => {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);

  // Load post detail
  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch post detail
        const postData = await fetchPostDetail(postId as string, user?.uid, token);
        setPost(postData);
        
        // Track view
        await trackPostView(postId as string, token);
        
        // Load initial comments
        const commentsData = await fetchCommentsPaginated(postId as string, 0, 10, token);
        setComments(commentsData);
        
      } catch (err) {
        console.error('Failed to load post detail:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPostDetail();
  }, [postId, token, user?.uid]);

  // Load more comments
  const loadMoreComments = async () => {
    if (!postId || loadingComments) return;
    
    try {
      setLoadingComments(true);
      const nextPage = commentsPage + 1;
      const newComments = await fetchCommentsPaginated(postId as string, nextPage, 10, token);
      
      if (newComments.length > 0) {
        setComments(prev => [...prev, ...newComments]);
        setCommentsPage(nextPage);
      }
    } catch (err) {
      console.error('Failed to load more comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle upvote
  const handleUpvote = async () => {
    if (!post || !token) return;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        isUpvoted: !prev.isUpvoted,
        upvotes: prev.isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1
      } : null);
      
      // Call API
      await fetch(`${config.api.baseUrl}/posts/${post.id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Failed to upvote:', err);
      // Revert optimistic update
      setPost(prev => prev ? {
        ...prev,
        isUpvoted: !prev.isUpvoted,
        upvotes: prev.isUpvoted ? prev.upvotes + 1 : prev.upvotes - 1
      } : null);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!post || !token) return;
    
    try {
      const shareData = {
        shareType: 'native',
        platform: 'app',
        userAgent: navigator.userAgent
      };
      
      await fetch(`${config.api.baseUrl}/posts/${post.id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shareData)
      });
      
      // Update share count
      setPost(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Post not found'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.user.credentials && (
              <Text style={styles.userCredentials}>{post.user.credentials}</Text>
            )}
            <Text style={styles.timestamp}>{formatTime(post.createdAt)}</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>
              {post.user.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <Text style={styles.question}>{post.question}</Text>

        {/* Answer */}
        <Text style={styles.answer}>{post.answer}</Text>

        {/* Media */}
        {post.mediaUrl && (
          <View style={styles.mediaContainer}>
            {post.mediaType === 'video' ? (
              <Video
                source={{ uri: post.mediaUrl }}
                style={styles.media}
                useNativeControls
                resizeMode="contain"
              />
            ) : (
              <Image source={{ uri: post.mediaUrl }} style={styles.media} />
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, post.isUpvoted && styles.upvotedButton]}
            onPress={handleUpvote}
          >
            <Ionicons 
              name={post.isUpvoted ? 'arrow-up' : 'arrow-up-outline'} 
              size={24} 
              color={post.isUpvoted ? '#FF6B35' : '#666'} 
            />
            <Text style={[styles.actionText, post.isUpvoted && styles.upvotedText]}>
              {post.upvotes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="alert-circle-outline" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({post.commentsCount})</Text>
          
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
              </View>
            </View>
          ))}
          
          {comments.length < post.commentsCount && (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={loadMoreComments}
              disabled={loadingComments}
            >
              {loadingComments ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.loadMoreText}>Load More Comments</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

### 3. **Update Mockfeed Navigation**

Ensure your Mockfeed component properly navigates to PostDetail:

```typescript
// app/screenComponents/Mockfeed.tsx
const handleReadMore = (post: Post) => {
  router.push({
    pathname: '/PostDetail',
    params: { postId: post.id }
  });
};
```

## 🔧 Backend Configuration

### 1. **Environment Variables**

Ensure your backend has the necessary environment variables:

```properties
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/bisa_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=classpath:firebase-service-account.json

# Server Configuration
SERVER_PORT=8080

# Logging
LOG_LEVEL=INFO
```

### 2. **CORS Configuration**

Verify your CORS configuration allows frontend requests:

```java
// WebConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:8081",
                "http://localhost:8082", 
                "http://localhost:3000",
                "http://localhost:19006"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
}
```

## 🧪 Testing Integration

### 1. **Start Both Services**

```bash
# Terminal 1 - Backend
cd Mobile-App-Project-backend
mvnw.cmd spring-boot:run "-Dspring.profiles.active=dev"

# Terminal 2 - Frontend  
cd Mobile-App-Project-G39-frontend
npm start
```

### 2. **Test API Endpoints**

```bash
# Test health endpoint
curl http://localhost:8080/api/hello/health

# Test post detail (with mock data)
curl http://localhost:8080/api/posts/1/detail

# Test view tracking
curl -X POST http://localhost:8080/api/posts/1/view
```

### 3. **Test Frontend Integration**

1. Open the app in Expo
2. Navigate to Home feed
3. Find a post with "Read More"
4. Tap "Read More"
5. Verify PostDetail loads with real data
6. Test interactions (upvote, share, etc.)

## 🔄 Data Flow

### **Complete Integration Flow:**

```
1. User taps "Read More" in feed
2. Frontend navigates to PostDetail with postId
3. PostDetail component loads
4. API call to /api/posts/{id}/detail
5. Backend fetches data from database
6. PostDetailResponse returned to frontend
7. UI renders with real data
8. View tracking API call made
9. User interactions update backend
10. UI updates optimistically
```

## 🎯 Key Features

### ✅ **Implemented:**
- **Real Data Fetching**: API integration with backend
- **View Tracking**: Analytics for post views
- **Interactive Features**: Upvotes, shares, comments
- **Error Handling**: Graceful error states
- **Loading States**: User feedback during loading
- **Optimistic Updates**: Immediate UI feedback

### 🔄 **Data Synchronization:**
- **Real-time Updates**: API calls for user interactions
- **State Management**: Proper state handling
- **Error Recovery**: Fallback to previous state on errors
- **Pagination**: Efficient comment loading

## 🚀 Production Considerations

### **Performance:**
- **Caching**: Implement response caching
- **Lazy Loading**: Load comments on demand
- **Image Optimization**: Use optimized image URLs
- **Bundle Splitting**: Code splitting for better performance

### **Security:**
- **Token Validation**: Proper Firebase token handling
- **Input Sanitization**: Validate all user inputs
- **Rate Limiting**: Prevent API abuse
- **HTTPS**: Secure communication

### **Monitoring:**
- **Error Tracking**: Monitor API failures
- **Performance Metrics**: Track response times
- **User Analytics**: Monitor feature usage
- **Crash Reporting**: Track app crashes

---

**Status: ✅ READY FOR INTEGRATION AND TESTING** 