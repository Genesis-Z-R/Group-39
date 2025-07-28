package com.bisa.service;

import com.bisa.dto.UserProfileResponse;
import com.bisa.model.User;
import com.bisa.model.Post;
import com.bisa.model.Follow;
import com.bisa.repository.UserRepository;
import com.bisa.repository.PostRepository;
import com.bisa.repository.FollowRepository;
import com.bisa.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserProfileService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final CommentRepository commentRepository;

    public UserProfileService(UserRepository userRepository, PostRepository postRepository,
                            FollowRepository followRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
    }

    public Optional<UserProfileResponse> getUserProfile(Long userId, Long currentUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        UserProfileResponse response = new UserProfileResponse();

        // Basic user information
        response.setId(user.getId());
        response.setName(user.getName());
        response.setAvatar(user.getAvatar());
        response.setCredentials(user.getCredentials());
        response.setBio(user.getBio());
        response.setLocation(user.getLocation());
        response.setWebsite(user.getWebsite());
        response.setJoinDate(user.getCreatedAt());

        // Check if current user is viewing their own profile
        boolean isCurrentUser = currentUserId != null && currentUserId.equals(userId);
        response.setCurrentUser(isCurrentUser);

        // Follow statistics
        int followersCount = followRepository.countByFollowedUser(user);
        int followingCount = followRepository.countByFollower(user);
        response.setFollowersCount(followersCount);
        response.setFollowingCount(followingCount);

        // Posts count
        int postsCount = postRepository.countByUser(user);
        response.setPostsCount(postsCount);

        // Check if current user is following this user
        boolean isFollowing = false;
        if (currentUserId != null && !isCurrentUser) {
            Optional<Follow> followOpt = followRepository.findByFollowerIdAndFollowedUserId(currentUserId, userId);
            isFollowing = followOpt.isPresent();
        }
        response.setFollowing(isFollowing);

        // Get user's posts (limited for profile view)
        List<Post> userPosts = postRepository.findByUserOrderByCreatedAtDesc(user);
        List<UserProfileResponse.UserPostSummary> postSummaries = userPosts.stream()
                .limit(5) // Limit to 5 most recent posts for profile
                .map(this::convertToPostSummary)
                .collect(Collectors.toList());
        response.setPosts(postSummaries);

        return Optional.of(response);
    }

    public Page<UserProfileResponse.UserPostSummary> getUserPosts(Long userId, Pageable pageable) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Page.empty(pageable);
        }

        User user = userOpt.get();
        Page<Post> postsPage = postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        return postsPage.map(this::convertToPostSummary);
    }

    public boolean followUser(Long followerId, Long followedUserId) {
        // Check if already following
        Optional<Follow> existingFollow = followRepository.findByFollowerIdAndFollowedUserId(followerId, followedUserId);
        if (existingFollow.isPresent()) {
            return false; // Already following
        }

        // Check if both users exist
        Optional<User> followerOpt = userRepository.findById(followerId);
        Optional<User> followedUserOpt = userRepository.findById(followedUserId);
        
        if (followerOpt.isEmpty() || followedUserOpt.isEmpty()) {
            return false;
        }

        // Create follow relationship
        Follow follow = new Follow();
        follow.setFollower(followerOpt.get());
        follow.setFollowedUser(followedUserOpt.get());
        follow.setFollowedAt(java.time.Instant.now());
        
        followRepository.save(follow);
        return true;
    }

    public boolean unfollowUser(Long followerId, Long followedUserId) {
        Optional<Follow> followOpt = followRepository.findByFollowerIdAndFollowedUserId(followerId, followedUserId);
        if (followOpt.isEmpty()) {
            return false; // Not following
        }

        followRepository.delete(followOpt.get());
        return true;
    }

    public Page<UserProfileResponse> getFollowers(Long userId, Pageable pageable) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Page.empty(pageable);
        }

        User user = userOpt.get();
        Page<Follow> followsPage = followRepository.findByFollowedUserOrderByFollowedAtDesc(user, pageable);
        
        return followsPage.map(follow -> {
            User follower = follow.getFollower();
            return new UserProfileResponse(
                follower.getId(),
                follower.getName(),
                follower.getAvatar(),
                follower.getCredentials(),
                follower.getBio(),
                follower.getLocation(),
                follower.getWebsite(),
                follower.getCreatedAt(),
                0, // We'll calculate these separately if needed
                0,
                0,
                false, // We'll calculate this separately if needed
                false
            );
        });
    }

    public Page<UserProfileResponse> getFollowing(Long userId, Pageable pageable) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Page.empty(pageable);
        }

        User user = userOpt.get();
        Page<Follow> followsPage = followRepository.findByFollowerOrderByFollowedAtDesc(user, pageable);
        
        return followsPage.map(follow -> {
            User followedUser = follow.getFollowedUser();
            return new UserProfileResponse(
                followedUser.getId(),
                followedUser.getName(),
                followedUser.getAvatar(),
                followedUser.getCredentials(),
                followedUser.getBio(),
                followedUser.getLocation(),
                followedUser.getWebsite(),
                followedUser.getCreatedAt(),
                0, // We'll calculate these separately if needed
                0,
                0,
                false, // We'll calculate this separately if needed
                false
            );
        });
    }

    private UserProfileResponse.UserPostSummary convertToPostSummary(Post post) {
        int commentsCount = commentRepository.countByPost(post);
        
        return new UserProfileResponse.UserPostSummary(
            post.getId(),
            post.getQuestion(),
            post.getAnswer(),
            post.getUpvotes(),
            commentsCount,
            post.getShares(),
            post.getCreatedAt()
        );
    }
} 