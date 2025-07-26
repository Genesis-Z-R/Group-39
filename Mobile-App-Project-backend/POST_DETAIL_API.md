# 📡 PostDetail Backend API Documentation

## 🎯 Overview

This document describes the backend API endpoints that support the PostDetail full-screen view functionality. These endpoints provide comprehensive post data including user information, comments, fact checks, share statistics, and analytics.

## 🔗 Base URL

```
http://localhost:8080/api/posts
```

## 📋 API Endpoints

### 1. Get Post Detail (Full-Screen View)

**Endpoint:** `GET /api/posts/{id}/detail`

**Description:** Retrieves comprehensive post information for the full-screen PostDetail view.

**Path Parameters:**
- `id` (Long, required): Post ID

**Query Parameters:**
- `userId` (Long, optional): Current user ID for personalized data

**Response:** `PostDetailResponse`

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/posts/1/detail?userId=123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response:**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    "credentials": "PhD in Computer Science, Former Google Engineer",
    "isFollowing": false
  },
  "question": "What are the most important programming concepts every developer should master?",
  "answer": "After 15 years in the industry, I believe these are the fundamental concepts...",
  "mediaUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  "mediaType": "image",
  "upvotes": 234,
  "shares": 12,
  "commentsCount": 45,
  "createdAt": "2024-01-15T10:30:00Z",
  "isUpvoted": false,
  "isBookmarked": false,
  "comments": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "name": "John Doe",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        "credentials": "Software Engineer",
        "isFollowing": false
      },
      "content": "Great insights! This really helped me understand the concepts better.",
      "createdAt": "2024-01-15T11:00:00Z",
      "upvotes": 5
    }
  ],
  "factCheck": {
    "id": 1,
    "validityStatus": "VERIFIED",
    "accuracyScore": 0.95,
    "confidenceLevel": "HIGH",
    "checkedBy": "system",
    "checkedAt": "2024-01-15T10:35:00Z",
    "summary": "This post contains accurate information about programming concepts."
  },
  "shareStats": {
    "totalShares": 12,
    "shareTypeBreakdown": [
      {
        "shareType": "native",
        "count": 8
      },
      {
        "shareType": "twitter",
        "count": 4
      }
    ],
    "platformBreakdown": [
      {
        "platform": "app",
        "count": 10
      },
      {
        "platform": "web",
        "count": 2
      }
    ]
  },
  "stats": {
    "viewCount": 1250,
    "uniqueViewers": 890,
    "engagementRate": 0.23,
    "lastViewed": "2024-01-15T12:00:00Z"
  }
}
```

### 2. Track Post View

**Endpoint:** `POST /api/posts/{id}/view`

**Description:** Tracks when a user views a post for analytics purposes.

**Path Parameters:**
- `id` (Long, required): Post ID

**Response:** View tracking confirmation

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/posts/1/view" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response:**
```json
{
  "postId": 1,
  "viewTracked": true,
  "timestamp": 1705312800000
}
```

### 3. Get Paginated Comments

**Endpoint:** `GET /api/posts/{id}/comments/paginated`

**Description:** Retrieves paginated comments for a post.

**Path Parameters:**
- `id` (Long, required): Post ID

**Query Parameters:**
- `page` (int, optional, default: 0): Page number (0-based)
- `size` (int, optional, default: 10): Number of comments per page

**Response:** List of `CommentInfo` objects

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/posts/1/comments/paginated?page=0&size=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "name": "John Doe",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      "credentials": "Software Engineer",
      "isFollowing": false
    },
    "content": "Great insights! This really helped me understand the concepts better.",
    "createdAt": "2024-01-15T11:00:00Z",
    "upvotes": 5
  },
  {
    "id": 2,
    "user": {
      "id": 3,
      "name": "Jane Smith",
      "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      "credentials": "Senior Developer",
      "isFollowing": false
    },
    "content": "I would also add that understanding system design is crucial for senior roles.",
    "createdAt": "2024-01-15T11:15:00Z",
    "upvotes": 3
  }
]
```

## 📊 Data Models

### PostDetailResponse

The main response object containing all post detail information.

**Fields:**
- `id` (Long): Post ID
- `user` (UserInfo): Post author information
- `question` (String): Post question
- `answer` (String): Post answer content
- `mediaUrl` (String, optional): Media URL
- `mediaType` (String, optional): Media type ('image' or 'video')
- `upvotes` (int): Number of upvotes
- `shares` (int): Number of shares
- `commentsCount` (int): Total number of comments
- `createdAt` (Instant): Post creation timestamp
- `isUpvoted` (boolean): Whether current user has upvoted
- `isBookmarked` (boolean): Whether current user has bookmarked
- `comments` (List<CommentInfo>): List of comments
- `factCheck` (FactCheckInfo, optional): Fact check information
- `shareStats` (ShareStats): Share statistics
- `stats` (PostStats): Post analytics

### UserInfo

User information for posts and comments.

**Fields:**
- `id` (Long): User ID
- `name` (String): User name
- `avatar` (String): User avatar URL
- `credentials` (String, optional): User credentials
- `isFollowing` (boolean): Whether current user is following this user

### CommentInfo

Comment information with user details.

**Fields:**
- `id` (Long): Comment ID
- `user` (UserInfo): Comment author
- `content` (String): Comment content
- `createdAt` (Instant): Comment creation timestamp
- `upvotes` (int): Number of upvotes on comment

### FactCheckInfo

Fact check information for posts.

**Fields:**
- `id` (Long): Fact check ID
- `validityStatus` (String): Validity status ('VERIFIED', 'UNVERIFIED', 'DISPUTED')
- `accuracyScore` (Double): Accuracy score (0.0 to 1.0)
- `confidenceLevel` (String): Confidence level ('LOW', 'MEDIUM', 'HIGH')
- `checkedBy` (String): Who performed the fact check
- `checkedAt` (Instant): When fact check was performed
- `summary` (String): Fact check summary

### ShareStats

Share statistics and breakdowns.

**Fields:**
- `totalShares` (int): Total number of shares
- `shareTypeBreakdown` (List<ShareTypeCount>): Breakdown by share type
- `platformBreakdown` (List<PlatformCount>): Breakdown by platform

### PostStats

Post analytics and engagement metrics.

**Fields:**
- `viewCount` (int): Total view count
- `uniqueViewers` (int): Number of unique viewers
- `engagementRate` (double): Engagement rate percentage
- `lastViewed` (Instant): Last view timestamp

## 🔐 Authentication

All endpoints require authentication via Firebase JWT token in the Authorization header:

```
Authorization: Bearer YOUR_FIREBASE_JWT_TOKEN
```

## 📝 Error Responses

### 404 Not Found
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Post not found",
  "path": "/api/posts/999/detail"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired Firebase token",
  "path": "/api/posts/1/detail"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/posts/1/detail"
}
```

## 🚀 Usage Examples

### Frontend Integration

```javascript
// Fetch post detail
const fetchPostDetail = async (postId, userId) => {
  const response = await fetch(`/api/posts/${postId}/detail?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Track post view
const trackPostView = async (postId) => {
  await fetch(`/api/posts/${postId}/view`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get paginated comments
const getComments = async (postId, page = 0, size = 10) => {
  const response = await fetch(`/api/posts/${postId}/comments/paginated?page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## 🔧 Implementation Notes

### Performance Considerations
- Comments are limited to 10 per request in the main detail endpoint
- Use pagination for loading more comments
- View tracking is asynchronous and doesn't block the response

### Caching Strategy
- Consider caching post detail responses for frequently accessed posts
- Implement cache invalidation when posts are updated

### Security
- All endpoints validate Firebase JWT tokens
- User-specific data (isUpvoted, isBookmarked) requires valid user ID
- Input validation is performed on all parameters

### Monitoring
- Track API response times and error rates
- Monitor view tracking analytics
- Log fact check performance metrics

---

**Status: ✅ IMPLEMENTED AND READY FOR INTEGRATION** 