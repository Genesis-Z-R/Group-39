package com.example.BACKEND_APIS.Service;


import com.example.BACKEND_APIS.Dto.UserResponse;
import com.example.BACKEND_APIS.Model.Follow;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Repository.FollowRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepo;
    @Autowired private UserRepository userRepo;

    public String followUser(Long followerId, Long followingId) {
        User follower = userRepo.findById(followerId).orElseThrow();
        User following = userRepo.findById(followingId).orElseThrow();

        if (followRepo.existsByFollowerAndFollowing(follower, following)) {
            return "Already following this user.";
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        follow.setFollowedAt(LocalDateTime.now());
        followRepo.save(follow);

        return "Followed successfully.";
    }

    public String unfollowUser(Long followerId, Long followingId) {
        User follower = userRepo.findById(followerId).orElseThrow();
        User following = userRepo.findById(followingId).orElseThrow();

        followRepo.deleteByFollowerAndFollowing(follower, following);
        return "Unfollowed successfully.";
    }

    public List<UserResponse> getFollowers(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return followRepo.findAllByFollowing(user)
                .stream()
                .map(f -> {
                    User u = f.getFollower();
                    return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getAvatarUrl());
                })
                .collect(Collectors.toList());
    }

    public List<UserResponse> getFollowing(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return followRepo.findAllByFollower(user)
                .stream()
                .map(f -> {
                    User u = f.getFollowing();
                    return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getAvatarUrl());
                })
                .collect(Collectors.toList());
    }
}
