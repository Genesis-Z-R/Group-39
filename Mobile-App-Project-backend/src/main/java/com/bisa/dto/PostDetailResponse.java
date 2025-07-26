package com.bisa.dto;

import com.bisa.model.Post;
import com.bisa.model.Comment;
import com.bisa.model.FactCheck;
import com.bisa.model.Share;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostDetailResponse {
    private Long id;
    private UserInfo user;
    private String question;
    private String answer;
    private String mediaUrl;
    private String mediaType;
    private int upvotes;
    private int shares;
    private int commentsCount;
    private Instant createdAt;
    private boolean isUpvoted;
    private boolean isBookmarked;
    private List<CommentInfo> comments;
    private FactCheckInfo factCheck;
    private ShareStats shareStats;
    private PostStats stats;

    // Nested classes for better organization
    public static class UserInfo {
        private Long id;
        private String name;
        private String avatar;
        private String credentials;
        private boolean isFollowing;

        public UserInfo() {}

        public UserInfo(Long id, String name, String avatar, String credentials, boolean isFollowing) {
            this.id = id;
            this.name = name;
            this.avatar = avatar;
            this.credentials = credentials;
            this.isFollowing = isFollowing;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public String getCredentials() { return credentials; }
        public void setCredentials(String credentials) { this.credentials = credentials; }

        public boolean isFollowing() { return isFollowing; }
        public void setFollowing(boolean following) { isFollowing = following; }
    }

    public static class CommentInfo {
        private Long id;
        private UserInfo user;
        private String content;
        private Instant createdAt;
        private int upvotes;

        public CommentInfo() {}

        public CommentInfo(Long id, UserInfo user, String content, Instant createdAt, int upvotes) {
            this.id = id;
            this.user = user;
            this.content = content;
            this.createdAt = createdAt;
            this.upvotes = upvotes;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public UserInfo getUser() { return user; }
        public void setUser(UserInfo user) { this.user = user; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

        public int getUpvotes() { return upvotes; }
        public void setUpvotes(int upvotes) { this.upvotes = upvotes; }
    }

    public static class FactCheckInfo {
        private Long id;
        private String validityStatus;
        private Double accuracyScore;
        private String confidenceLevel;
        private String checkedBy;
        private Instant checkedAt;
        private String summary;

        public FactCheckInfo() {}

        public FactCheckInfo(Long id, String validityStatus, Double accuracyScore, String confidenceLevel, 
                           String checkedBy, Instant checkedAt, String summary) {
            this.id = id;
            this.validityStatus = validityStatus;
            this.accuracyScore = accuracyScore;
            this.confidenceLevel = confidenceLevel;
            this.checkedBy = checkedBy;
            this.checkedAt = checkedAt;
            this.summary = summary;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getValidityStatus() { return validityStatus; }
        public void setValidityStatus(String validityStatus) { this.validityStatus = validityStatus; }

        public Double getAccuracyScore() { return accuracyScore; }
        public void setAccuracyScore(Double accuracyScore) { this.accuracyScore = accuracyScore; }

        public String getConfidenceLevel() { return confidenceLevel; }
        public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

        public String getCheckedBy() { return checkedBy; }
        public void setCheckedBy(String checkedBy) { this.checkedBy = checkedBy; }

        public Instant getCheckedAt() { return checkedAt; }
        public void setCheckedAt(Instant checkedAt) { this.checkedAt = checkedAt; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
    }

    public static class ShareStats {
        private int totalShares;
        private List<ShareTypeCount> shareTypeBreakdown;
        private List<PlatformCount> platformBreakdown;

        public ShareStats() {}

        public ShareStats(int totalShares, List<ShareTypeCount> shareTypeBreakdown, List<PlatformCount> platformBreakdown) {
            this.totalShares = totalShares;
            this.shareTypeBreakdown = shareTypeBreakdown;
            this.platformBreakdown = platformBreakdown;
        }

        // Getters and setters
        public int getTotalShares() { return totalShares; }
        public void setTotalShares(int totalShares) { this.totalShares = totalShares; }

        public List<ShareTypeCount> getShareTypeBreakdown() { return shareTypeBreakdown; }
        public void setShareTypeBreakdown(List<ShareTypeCount> shareTypeBreakdown) { this.shareTypeBreakdown = shareTypeBreakdown; }

        public List<PlatformCount> getPlatformBreakdown() { return platformBreakdown; }
        public void setPlatformBreakdown(List<PlatformCount> platformBreakdown) { this.platformBreakdown = platformBreakdown; }
    }

    public static class ShareTypeCount {
        private String shareType;
        private int count;

        public ShareTypeCount() {}

        public ShareTypeCount(String shareType, int count) {
            this.shareType = shareType;
            this.count = count;
        }

        public String getShareType() { return shareType; }
        public void setShareType(String shareType) { this.shareType = shareType; }

        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }

    public static class PlatformCount {
        private String platform;
        private int count;

        public PlatformCount() {}

        public PlatformCount(String platform, int count) {
            this.platform = platform;
            this.count = count;
        }

        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }

        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }

    public static class PostStats {
        private int viewCount;
        private int uniqueViewers;
        private double engagementRate;
        private Instant lastViewed;

        public PostStats() {}

        public PostStats(int viewCount, int uniqueViewers, double engagementRate, Instant lastViewed) {
            this.viewCount = viewCount;
            this.uniqueViewers = uniqueViewers;
            this.engagementRate = engagementRate;
            this.lastViewed = lastViewed;
        }

        // Getters and setters
        public int getViewCount() { return viewCount; }
        public void setViewCount(int viewCount) { this.viewCount = viewCount; }

        public int getUniqueViewers() { return uniqueViewers; }
        public void setUniqueViewers(int uniqueViewers) { this.uniqueViewers = uniqueViewers; }

        public double getEngagementRate() { return engagementRate; }
        public void setEngagementRate(double engagementRate) { this.engagementRate = engagementRate; }

        public Instant getLastViewed() { return lastViewed; }
        public void setLastViewed(Instant lastViewed) { this.lastViewed = lastViewed; }
    }

    // Main class constructors
    public PostDetailResponse() {}

    public PostDetailResponse(Long id, UserInfo user, String question, String answer, String mediaUrl, 
                            String mediaType, int upvotes, int shares, int commentsCount, Instant createdAt) {
        this.id = id;
        this.user = user;
        this.question = question;
        this.answer = answer;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
        this.upvotes = upvotes;
        this.shares = shares;
        this.commentsCount = commentsCount;
        this.createdAt = createdAt;
    }

    // Getters and setters for main class
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }

    public int getShares() { return shares; }
    public void setShares(int shares) { this.shares = shares; }

    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public boolean isUpvoted() { return isUpvoted; }
    public void setUpvoted(boolean upvoted) { isUpvoted = upvoted; }

    public boolean isBookmarked() { return isBookmarked; }
    public void setBookmarked(boolean bookmarked) { isBookmarked = bookmarked; }

    public List<CommentInfo> getComments() { return comments; }
    public void setComments(List<CommentInfo> comments) { this.comments = comments; }

    public FactCheckInfo getFactCheck() { return factCheck; }
    public void setFactCheck(FactCheckInfo factCheck) { this.factCheck = factCheck; }

    public ShareStats getShareStats() { return shareStats; }
    public void setShareStats(ShareStats shareStats) { this.shareStats = shareStats; }

    public PostStats getStats() { return stats; }
    public void setStats(PostStats stats) { this.stats = stats; }
} 