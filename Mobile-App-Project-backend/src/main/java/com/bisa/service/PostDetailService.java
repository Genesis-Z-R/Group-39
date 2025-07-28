package com.bisa.service;

import com.bisa.dto.PostDetailResponse;
import com.bisa.model.Post;
import com.bisa.model.Comment;
import com.bisa.model.FactCheck;
import com.bisa.model.Share;
import com.bisa.model.User;
import com.bisa.repository.PostRepository;
import com.bisa.repository.CommentRepository;
import com.bisa.repository.ShareRepository;
import com.bisa.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostDetailService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ShareRepository shareRepository;
    private final UserRepository userRepository;
    private final FactCheckService factCheckService;

    public PostDetailService(PostRepository postRepository, CommentRepository commentRepository, 
                           ShareRepository shareRepository, UserRepository userRepository, 
                           FactCheckService factCheckService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.factCheckService = factCheckService;
    }

    public Optional<PostDetailResponse> getPostDetail(Long postId, Long currentUserId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            return Optional.empty();
        }

        Post post = postOpt.get();
        PostDetailResponse response = new PostDetailResponse();
        
        // Basic post information
        response.setId(post.getId());
        response.setQuestion(post.getQuestion());
        response.setAnswer(post.getAnswer());
        response.setMediaUrl(post.getMediaUrl());
        response.setMediaType(post.getMediaType());
        response.setUpvotes(post.getUpvotes());
        response.setShares(post.getShares());
        response.setCreatedAt(post.getCreatedAt());

        // User information
        User postUser = post.getUser();
        PostDetailResponse.UserInfo userInfo = new PostDetailResponse.UserInfo(
            postUser.getId(),
            postUser.getName(),
            postUser.getAvatar(),
            postUser.getCredentials(),
            isUserFollowing(currentUserId, postUser.getId())
        );
        response.setUser(userInfo);

        // Comments
        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(post);
        response.setCommentsCount(comments.size());
        
        List<PostDetailResponse.CommentInfo> commentInfos = comments.stream()
            .limit(10) // Limit to first 10 comments for performance
            .map(this::convertToCommentInfo)
            .collect(Collectors.toList());
        response.setComments(commentInfos);

        // Fact check information
        Optional<FactCheck> latestFactCheck = factCheckService.getLatestFactCheck(post);
        if (latestFactCheck.isPresent()) {
            FactCheck factCheck = latestFactCheck.get();
            PostDetailResponse.FactCheckInfo factCheckInfo = new PostDetailResponse.FactCheckInfo(
                factCheck.getId(),
                factCheck.getValidityStatus(),
                factCheck.getAccuracyScore(),
                factCheck.getConfidenceLevel(),
                factCheck.getCheckedBy(),
                factCheck.getCheckedAt(),
                factCheck.getSummary()
            );
            response.setFactCheck(factCheckInfo);
        }

        // Share statistics
        List<Share> shares = shareRepository.findByPostOrderBySharedAtDesc(post);
        PostDetailResponse.ShareStats shareStats = buildShareStats(shares);
        response.setShareStats(shareStats);

        // Post statistics
        PostDetailResponse.PostStats postStats = buildPostStats(post);
        response.setStats(postStats);

        // User interaction status
        response.setUpvoted(isPostUpvotedByUser(postId, currentUserId));
        response.setBookmarked(isPostBookmarkedByUser(postId, currentUserId));

        return Optional.of(response);
    }

    private PostDetailResponse.CommentInfo convertToCommentInfo(Comment comment) {
        User commentUser = comment.getUser();
        PostDetailResponse.UserInfo userInfo = new PostDetailResponse.UserInfo(
            commentUser.getId(),
            commentUser.getName(),
            commentUser.getAvatar(),
            commentUser.getCredentials(),
            false // Following status not needed for comments
        );

        return new PostDetailResponse.CommentInfo(
            comment.getId(),
            userInfo,
            comment.getContent(),
            comment.getCreatedAt(),
            0 // Upvotes not implemented yet
        );
    }

    private PostDetailResponse.ShareStats buildShareStats(List<Share> shares) {
        // Group by share type
        var shareTypeCounts = shares.stream()
            .collect(Collectors.groupingBy(
                Share::getShareType,
                Collectors.counting()
            ));

        List<PostDetailResponse.ShareTypeCount> shareTypeBreakdown = shareTypeCounts.entrySet().stream()
            .map(entry -> new PostDetailResponse.ShareTypeCount(entry.getKey(), entry.getValue().intValue()))
            .collect(Collectors.toList());

        // Group by platform
        var platformCounts = shares.stream()
            .collect(Collectors.groupingBy(
                Share::getPlatform,
                Collectors.counting()
            ));

        List<PostDetailResponse.PlatformCount> platformBreakdown = platformCounts.entrySet().stream()
            .map(entry -> new PostDetailResponse.PlatformCount(entry.getKey(), entry.getValue().intValue()))
            .collect(Collectors.toList());

        return new PostDetailResponse.ShareStats(shares.size(), shareTypeBreakdown, platformBreakdown);
    }

    private PostDetailResponse.PostStats buildPostStats(Post post) {
        // This would typically come from a view tracking system
        // For now, we'll use basic calculations
        int viewCount = post.getUpvotes() + post.getShares() + commentRepository.countByPost(post);
        int uniqueViewers = viewCount; // Simplified for now
        double engagementRate = calculateEngagementRate(post);
        
        return new PostDetailResponse.PostStats(
            viewCount,
            uniqueViewers,
            engagementRate,
            post.getCreatedAt()
        );
    }

    private double calculateEngagementRate(Post post) {
        int totalInteractions = post.getUpvotes() + post.getShares() + commentRepository.countByPost(post);
        // Simplified engagement rate calculation
        return totalInteractions > 0 ? (double) totalInteractions / 100 : 0.0;
    }

    private boolean isUserFollowing(Long followerId, Long followingId) {
        if (followerId == null || followingId == null) {
            return false;
        }
        // This would typically check a follow relationship table
        // For now, return false as placeholder
        return false;
    }

    private boolean isPostUpvotedByUser(Long postId, Long userId) {
        if (userId == null) {
            return false;
        }
        // This would typically check an upvote relationship table
        // For now, return false as placeholder
        return false;
    }

    private boolean isPostBookmarkedByUser(Long postId, Long userId) {
        if (userId == null) {
            return false;
        }
        // This would typically check a bookmark relationship table
        // For now, return false as placeholder
        return false;
    }

    public void incrementViewCount(Long postId) {
        // This would typically update a view tracking system
        // For now, we'll just log the view
        System.out.println("Post " + postId + " viewed");
    }

    public List<PostDetailResponse.CommentInfo> getCommentsForPost(Long postId, int page, int size) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            return List.of();
        }

        // This would typically use pagination
        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(postOpt.get());
        
        return comments.stream()
            .skip(page * size)
            .limit(size)
            .map(this::convertToCommentInfo)
            .collect(Collectors.toList());
    }
} 