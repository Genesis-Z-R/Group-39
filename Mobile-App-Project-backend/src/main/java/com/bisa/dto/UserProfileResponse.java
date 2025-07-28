package com.bisa.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {
    private Long id;
    private String name;
    private String avatar;
    private String credentials;
    private String bio;
    private String location;
    private String website;
    private Instant joinDate;
    private int followersCount;
    private int followingCount;
    private int postsCount;
    private boolean isFollowing;
    private boolean isCurrentUser;
    private List<UserPostSummary> posts;

    // Constructors
    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String name, String avatar, String credentials, 
                             String bio, String location, String website, Instant joinDate,
                             int followersCount, int followingCount, int postsCount,
                             boolean isFollowing, boolean isCurrentUser) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.credentials = credentials;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.joinDate = joinDate;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.postsCount = postsCount;
        this.isFollowing = isFollowing;
        this.isCurrentUser = isCurrentUser;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getCredentials() {
        return credentials;
    }

    public void setCredentials(String credentials) {
        this.credentials = credentials;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Instant getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Instant joinDate) {
        this.joinDate = joinDate;
    }

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public int getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(int postsCount) {
        this.postsCount = postsCount;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }

    public boolean isCurrentUser() {
        return isCurrentUser;
    }

    public void setCurrentUser(boolean currentUser) {
        isCurrentUser = currentUser;
    }

    public List<UserPostSummary> getPosts() {
        return posts;
    }

    public void setPosts(List<UserPostSummary> posts) {
        this.posts = posts;
    }

    // Nested class for user post summaries
    public static class UserPostSummary {
        private Long id;
        private String question;
        private String answer;
        private int upvotes;
        private int comments;
        private int shares;
        private Instant createdAt;

        public UserPostSummary() {}

        public UserPostSummary(Long id, String question, String answer, int upvotes, 
                             int comments, int shares, Instant createdAt) {
            this.id = id;
            this.question = question;
            this.answer = answer;
            this.upvotes = upvotes;
            this.comments = comments;
            this.shares = shares;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public int getUpvotes() {
            return upvotes;
        }

        public void setUpvotes(int upvotes) {
            this.upvotes = upvotes;
        }

        public int getComments() {
            return comments;
        }

        public void setComments(int comments) {
            this.comments = comments;
        }

        public int getShares() {
            return shares;
        }

        public void setShares(int shares) {
            this.shares = shares;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
} 